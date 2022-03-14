/*
 * This file is part of PupCloud, Copyright (c) 2022-2078, Germano Rizzo
 *
 * PupCloud is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * PupCloud is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with PupCloud.  If not, see <http://www.gnu.org/licenses/>.
 */
package main

import (
	"crypto/sha256"
	"embed"
	"encoding/hex"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/otiai10/copy"
	"github.com/proofrock/pupcloud/commons"
	flag "github.com/spf13/pflag"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/csrf"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gofiber/fiber/v2/utils"
)

const Version = "v0.4.2"

//go:embed static
var static embed.FS

func errHandler(ctx *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	msg := err.Error()

	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
	} else {
		if msg[3] == '|' {
			code, _ = strconv.Atoi(msg[:3])
			msg = msg[4:]
		}
	}

	return ctx.Status(code).SendString(msg)
}

type item struct {
	MimeType    string `json:"mimeType"`
	Name        string `json:"name"`
	Size        int64  `json:"size"`
	ChDate      int64  `json:"chDate"`
	Owner       string `json:"owner"`
	Group       string `json:"group"`
	Permissions string `json:"permissions"`
}

type res struct {
	Path  []string `json:"path"`
	Items []item   `json:"items"`
}

type sharing struct {
	Allowed      bool
	AllowRW      bool     `json:"allowRW"`
	TokenNames   []string `json:"tokens"`
	TokenSecrets []string
}

type featuRes struct {
	Version  string   `json:"version"`
	Title    string   `json:"title"`
	ReadOnly bool     `json:"readonly"`
	Sharing  *sharing `json:"sharing,omitempty"`
}

func main() {
	year := time.Now().Year()
	if year == 2022 {
		println(fmt.Sprintf("Pupcloud %s (c) 2022 Germano Rizzo", Version))
	} else {
		println(fmt.Sprintf("Pupcloud %s (c) 2022-%d Germano Rizzo", Version, year))
	}

	root := flag.StringP("root", "r", "", "The document root to serve")
	bindTo := flag.String("bind-to", "0.0.0.0", "The address to bind to")
	port := flag.IntP("port", "p", 17178, "The port to run on")
	title := flag.String("title", "🐶 Pupcloud", "Title of the window")
	pwdHash := flag.StringP("pwd-hash", "P", "", "SHA256 hash of the main access password")
	readOnly := flag.Bool("readonly", false, "Disallow all changes to FS")
	allowRWSharing := flag.Bool("allow-rw-sharing", false, "Allow to share folders as read/write")
	tokens := flag.StringArray("share-token", []string{}, "Token for sharing, in form name:secret, multiple allowed")

	flag.Parse()

	if *root == "" {
		println("ERROR: You must specify a root (-r)")
		os.Exit(-1)
	}

	if *readOnly && *allowRWSharing {
		println("ERROR: cannot allow R/W shares if Read Only")
		os.Exit(-1)
	}

	sharing := sharing{}

	if len(*tokens) > 0 {
		sharing.Allowed = true
		for i, tok := range *tokens {
			pos := strings.Index(tok, ":")
			if pos < 0 {
				println(fmt.Sprintf("ERROR: malformed token #%d: it must have a ':'", i+1))
				os.Exit(-1)
			}
			sharing.TokenNames = append(sharing.TokenNames, tok[0:pos])
			sharing.TokenSecrets = append(sharing.TokenSecrets, tok[pos+1:])
		}
	}

	println(fmt.Sprintf(" - Serving dir %s", *root))

	if sharing.Allowed {
		println(" - Sharing enabled")
		println(fmt.Sprintf("   + With tokens %s:", strings.Join(sharing.TokenNames, ",")))
	}

	app := fiber.New(
		fiber.Config{
			ErrorHandler:          errHandler,
			DisableStartupMessage: true,
		},
	)

	app.Use(compress.New())
	// FIXME: it works, but does it do anything?
	app.Use(csrf.New(csrf.Config{
		CookieSameSite: "Strict",
		Expiration:     24 * time.Hour,
		KeyGenerator:   utils.UUIDv4,
	}))

	app.Use(func(c *fiber.Ctx) error {
		c.Locals("pwdHash", *pwdHash)
		c.Locals("root", *root)
		c.Locals("title", *title)
		c.Locals("readOnly", *readOnly)
		c.Locals("sharing", &sharing)
		return c.Next()
	})

	app.Get("/features", features)
	app.Get("/ls", ls)
	app.Get("/file", file)
	app.Get("/shareLink", shareLink)
	app.Delete("/fsOps/del", fsDel)
	app.Post("/fsOps/rename", fsRename)
	app.Post("/fsOps/move", fsMove)
	app.Post("/fsOps/copy", fsCopy)
	app.Put("/fsOps/newFolder", fsNewFolder)
	app.Put("/fsOps/upload", fsUpload)
	app.Put("/fsOps/upload", fsUpload)

	subFS, _ := fs.Sub(static, "static")
	app.Use("/", filesystem.New(filesystem.Config{
		Root: http.FS(subFS),
	}))

	println(fmt.Sprintf(" - Server running on port %d", *port))
	log.Fatal(app.Listen(fmt.Sprintf("%s:%d", *bindTo, *port)))
}

var sessions sync.Map

func doAuth(c *fiber.Ctx, pwdHash string) error {
	if pwdHash == "" {
		return nil
	}

	val := c.Cookies("pupcloud-session")
	if val != "" {
		if _, ok := sessions.Load(val); ok {
			return nil
		}
	}

	pwd := c.Query("pwd")
	if pwd == "" {
		pwd = c.Get("x-pupcloud-pwd")
	}

	// XXX I use 499 because 401 plus a reverse proxy seems to trigger a Basic Authentication
	// prompt in the browser
	if pwd == "" {
		return fiber.NewError(499, "Password required or wrong password")
	}

	hash := sha256.Sum256([]byte(pwd))
	if !strings.HasPrefix(hex.EncodeToString(hash[:]), strings.ToLower(pwdHash)) {
		return fiber.NewError(499, "Password required or wrong password")
	}

	rnd := utils.UUIDv4()
	cookie := new(fiber.Cookie)
	cookie.Name = "pupcloud-session"
	cookie.Value = rnd
	cookie.Expires = time.Now().Add(24 * time.Hour)
	cookie.SessionOnly = true
	cookie.SameSite = "strict"
	c.Cookie(cookie)
	sessions.Store(rnd, true)

	return nil
}

func features(c *fiber.Ctx) error {
	if err := doAuth(c, c.Locals("pwdHash").(string)); err != nil {
		return err
	}

	sharing := c.Locals("sharing").(*sharing)

	if !sharing.Allowed {
		return c.JSON(featuRes{
			Version:  Version,
			Title:    c.Locals("title").(string),
			ReadOnly: c.Locals("readOnly").(bool),
		})
	} else {
		return c.JSON(featuRes{
			Version:  Version,
			Title:    c.Locals("title").(string),
			ReadOnly: c.Locals("readOnly").(bool),
			Sharing:  sharing,
		})
	}
}

func ls(c *fiber.Ctx) error {
	if err := doAuth(c, c.Locals("pwdHash").(string)); err != nil {
		return err
	}

	root := c.Locals("root").(string)
	path := c.Query("path", "/")

	rootAndPath := filepath.Join(root, path)
	file, errPath := os.Stat(rootAndPath)
	if errPath != nil {
		return c.Status(fiber.StatusNotFound).SendString("Path not found")
	}
	if !file.IsDir() {
		return c.Download(rootAndPath)
	}

	files, errPath := os.ReadDir(rootAndPath)
	if errPath != nil {
		return c.Status(fiber.StatusNotFound).SendString("Path not found")
	}

	res := res{Path: make([]string, 0), Items: make([]item, 0)}

	for _, it := range strings.Split(path, "/") {
		if it != "" {
			res.Path = append(res.Path, it)
		}
	}

	for _, f := range files {
		var item item
		item.Name = f.Name()
		finfo, finfoError := f.Info()
		if finfoError != nil {
			continue
		}
		item.ChDate = finfo.ModTime().Unix()
		item.Permissions = finfo.Mode().String()
		fullPath := filepath.Join(rootAndPath, f.Name())
		item.Owner, item.Group = getUserAndGroup(fullPath)
		if f.IsDir() {
			item.MimeType = "directory"
			item.Size = -1
		} else {
			item.MimeType = getFileContentType(fullPath)
			item.Size = finfo.Size()
		}
		res.Items = append(res.Items, item)
	}
	return c.JSON(res)
}

// Adapted from https://github.com/gofiber/fiber/blob/master/middleware/filesystem/filesystem.go
func file(c *fiber.Ctx) error {
	if err := doAuth(c, c.Locals("pwdHash").(string)); err != nil {
		return err
	}

	path := c.Query("path")
	forDownload := c.Query("dl", "0") == "1"
	if path == "" {
		return fiber.ErrNotFound
	}

	root := c.Locals("root").(string)

	fullPath := filepath.Join(root, path)
	present, contentType, length := getFileInfoForHTTP(fullPath)
	if !present {
		return fiber.ErrNotFound
	}

	c.Set("Content-Type", contentType)
	c.Set("Content-Length", fmt.Sprintf("%d", length))
	if forDownload {
		c.Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", filepath.Base(fullPath)))
	} else {
		c.Set("Content-Disposition", fmt.Sprintf("inline; filename=\"%s\"", filepath.Base(fullPath)))
	}

	return c.SendFile(fullPath)
}

func shareLink(c *fiber.Ctx) error {
	sharing := c.Locals("sharing").(*sharing)

	if !sharing.Allowed {
		fiber.NewError(fiber.StatusBadRequest, "Sharing is not allowed")
	}

	pwd := c.Query("pwd")
	if pwd == "" {
		return fiber.NewError(fiber.StatusBadRequest, "'dir' not specified")
	}

	dir := c.Query("dir")
	if dir == "" {
		return fiber.NewError(fiber.StatusBadRequest, "'dir' not specified")
	}

	strReadOnly := c.Query("readOnly")
	if strReadOnly == "" {
		return fiber.NewError(fiber.StatusBadRequest, "'readOnly' not specified")
	}
	readOnly := strReadOnly == "1"

	token := c.Query("token")
	if token == "" {
		return fiber.NewError(fiber.StatusBadRequest, "'token' not specified")
	}

	var expiry *uint32
	_expiry := c.Query("expiry")
	if _expiry == "" {
		_expiryInt, err := strconv.Atoi(strings.ReplaceAll(_expiry, "-", ""))
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "'expiry' date not valid")
		}
		expiryUInt := uint32(_expiryInt)
		expiry = &expiryUInt
	}

	tkIdx := commons.FindString(token, sharing.TokenNames)
	if tkIdx < 0 {
		return fiber.NewError(fiber.StatusBadRequest, "Unknown token")
	}
	secret := sharing.TokenSecrets[tkIdx]
	password := pwd + "|" + secret

	ret, err := commons.EncryptSharingURL(password, dir, readOnly, expiry)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	return c.SendString(ret)
}

func fsDel(c *fiber.Ctx) error {
	if c.Locals("readOnly").(bool) {
		return fiber.NewError(fiber.StatusForbidden, "Read-only mode enabled")
	}

	if err := doAuth(c, c.Locals("pwdHash").(string)); err != nil {
		return err
	}

	path := c.Query("path")
	if path == "" {
		return fiber.ErrBadRequest
	}

	root := c.Locals("root").(string)

	fullPath := filepath.Join(root, path)
	if err := os.RemoveAll(fullPath); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.SendStatus(200)
}

func fsRename(c *fiber.Ctx) error {
	if c.Locals("readOnly").(bool) {
		return fiber.NewError(fiber.StatusForbidden, "Read-only mode enabled")
	}

	if err := doAuth(c, c.Locals("pwdHash").(string)); err != nil {
		return err
	}

	path := c.Query("path")
	nuName := c.Query("name")
	if path == "" || nuName == "" {
		return fiber.ErrBadRequest
	}

	root := c.Locals("root").(string)

	fullPath := filepath.Join(root, path)
	newPath := filepath.Join(filepath.Dir(fullPath), nuName)

	if commons.FileExists(newPath) {
		return fiber.NewError(fiber.StatusBadRequest, "File already exists")
	}

	if err := os.Rename(fullPath, newPath); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.SendStatus(200)
}

func fsMove(c *fiber.Ctx) error {
	if c.Locals("readOnly").(bool) {
		return fiber.NewError(fiber.StatusForbidden, "Read-only mode enabled")
	}

	if err := doAuth(c, c.Locals("pwdHash").(string)); err != nil {
		return err
	}

	path := c.Query("path")
	destDir := c.Query("destDir")
	if path == "" || destDir == "" {
		return fiber.ErrBadRequest
	}

	root := c.Locals("root").(string)

	fullPath := filepath.Join(root, path)
	newPath := filepath.Join(root, destDir, filepath.Base(fullPath))

	if commons.FileExists(newPath) {
		return fiber.NewError(fiber.StatusBadRequest, "File already exists")
	}

	if err := os.Rename(fullPath, newPath); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.SendStatus(200)
}

func fsCopy(c *fiber.Ctx) error {
	if c.Locals("readOnly").(bool) {
		return fiber.NewError(fiber.StatusForbidden, "Read-only mode enabled")
	}

	if err := doAuth(c, c.Locals("pwdHash").(string)); err != nil {
		return err
	}

	path := c.Query("path")
	destDir := c.Query("destDir")
	if path == "" || destDir == "" {
		return fiber.ErrBadRequest
	}

	root := c.Locals("root").(string)

	fullPath := filepath.Join(root, path)
	newPath := filepath.Join(root, destDir, filepath.Base(fullPath))

	if commons.FileExists(newPath) {
		return fiber.NewError(fiber.StatusBadRequest, "File already exists")
	}

	if err := copy.Copy(fullPath, newPath); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.SendStatus(200)
}

func fsNewFolder(c *fiber.Ctx) error {
	if c.Locals("readOnly").(bool) {
		return fiber.NewError(fiber.StatusForbidden, "Read-only mode enabled")
	}

	if err := doAuth(c, c.Locals("pwdHash").(string)); err != nil {
		return err
	}

	path := c.Query("path")
	if path == "" {
		return fiber.ErrBadRequest
	}

	root := c.Locals("root").(string)

	fullPath := filepath.Join(root, path)

	if commons.FileExists(fullPath) {
		return fiber.NewError(fiber.StatusBadRequest, "File already exists")
	}

	if err := os.Mkdir(fullPath, os.FileMode(int(0755))); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.SendStatus(200)
}

func fsUpload(c *fiber.Ctx) error {
	if c.Locals("readOnly").(bool) {
		return fiber.NewError(fiber.StatusForbidden, "Read-only mode enabled")
	}

	if err := doAuth(c, c.Locals("pwdHash").(string)); err != nil {
		return err
	}

	form, err := c.MultipartForm()
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "It's not multipart")
	}

	path := c.Query("path")
	if path == "" {
		return fiber.ErrBadRequest
	}

	root := c.Locals("root").(string)

	fullPath := filepath.Join(root, path)

	files := form.File["doc"]
	for _, file := range files {
		if err := c.SaveFile(file, filepath.Join(fullPath, file.Filename)); err != nil {
			return err
		}
	}
	return err
}
