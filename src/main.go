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
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/proofrock/pupcloud/commons"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"

	flag "github.com/spf13/pflag"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/csrf"
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
	Allowed      bool     `json:"-"`
	AllowRW      bool     `json:"allowRW"`
	TokenNames   []string `json:"tokens"`
	TokenSecrets []string `json:"-"`
	Prefix       string   `json:"-"`
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
	sharePrefix := flag.String("share-prefix", "", "The base URL of the sharing interface")
	sharePort := flag.Int("share-port", 17179, "The port of the sharing interface")

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

	if (len(*tokens) > 0) != (*sharePrefix != "") {
		println("Both '--share-token' and '--share-prefix' must be specified")
		os.Exit(-1)
	}

	if *sharePrefix != "" {
		if !(strings.HasPrefix(*sharePrefix, "http://") || strings.HasPrefix(*sharePrefix, "https://")) || strings.HasSuffix(*sharePrefix, "/") {
			println("Malformed '--share-prefix': protocol must be http or https, and it must not end with a '/'")
			os.Exit(-1)
		}
	}

	if len(*tokens) > 0 {
		sharing.Allowed = true
		sharing.Prefix = *sharePrefix
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
		println(fmt.Sprintf("   + With tokens: %s", strings.Join(sharing.TokenNames, ",")))
		go launchSharingApp(*bindTo, *root, *title, *sharePort, &sharing)
		time.Sleep(1 * time.Second)
	}

	launchMainApp(*bindTo, *root, *title, *pwdHash, *port, *readOnly, &sharing)
}

// FIXME limit growth
var sessions sync.Map

func launchMainApp(bindTo, root, title, pwdHash string, port int, readOnly bool, sharing *sharing) {
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

	subFS, _ := fs.Sub(static, "static")
	app.Use("/", filesystem.New(filesystem.Config{
		Root: http.FS(subFS),
	}))

	app.Use(func(c *fiber.Ctx) error {
		if err := doAuth4MainApp(c, pwdHash); err != nil {
			return err
		}

		c.Locals("root", root)
		c.Locals("title", title)
		c.Locals("readOnly", readOnly)
		c.Locals("sharing", sharing)
		return c.Next()
	})

	app.Get("/features", features)
	app.Get("/ls", ls)
	app.Get("/file", file)
	if sharing != nil && sharing.Allowed {
		app.Get("/shareLink", shareLink)
	}
	if !readOnly {
		app.Delete("/fsOps/del", fsDel)
		app.Post("/fsOps/rename", fsRename)
		app.Post("/fsOps/move", fsMove)
		app.Post("/fsOps/copy", fsCopy)
		app.Put("/fsOps/newFolder", fsNewFolder)
		app.Put("/fsOps/upload", fsUpload)
		app.Put("/fsOps/upload", fsUpload)
	}

	time.Sleep(1 * time.Second)

	println(fmt.Sprintf(" - Server running on port %d", port))
	log.Fatal(app.Listen(fmt.Sprintf("%s:%d", bindTo, port)))
}

func doAuth4MainApp(c *fiber.Ctx, pwdHash string) error {
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

// Stored in the session map, to recover it from the session cookie
type sharInfo struct {
	path     string
	readOnly bool
}

func launchSharingApp(bindTo, root, title string, port int, sharing *sharing) {
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

	subFS, _ := fs.Sub(static, "static")
	app.Use("/", filesystem.New(filesystem.Config{
		Root: http.FS(subFS),
	}))

	app.Use(func(c *fiber.Ctx) error {
		sharinfo, err := doAuth4SharingApp(c, root, sharing)
		if err != nil {
			return err
		}

		if sharinfo.path != "/" && strings.HasSuffix(sharinfo.path, "/") {
			sharinfo.path = sharinfo.path[:len(sharinfo.path)-2]
		}
		c.Locals("root", sharinfo.path)
		c.Locals("title", title)
		c.Locals("readOnly", sharinfo.readOnly)
		return c.Next()
	})

	app.Get("/features", features)
	app.Get("/ls", ls)
	app.Get("/file", file)
	app.Delete("/fsOps/del", fsDel)
	app.Post("/fsOps/rename", fsRename)
	app.Post("/fsOps/move", fsMove)
	app.Post("/fsOps/copy", fsCopy)
	app.Put("/fsOps/newFolder", fsNewFolder)
	app.Put("/fsOps/upload", fsUpload)
	app.Put("/fsOps/upload", fsUpload)

	println(fmt.Sprintf(" - Sharing server running on port %d", port))
	log.Fatal(app.Listen(fmt.Sprintf("%s:%d", bindTo, port)))
}

func doAuth4SharingApp(c *fiber.Ctx, root string, sharing *sharing) (*sharInfo, error) {
	val := c.Cookies("pupcloud-sharing-session")
	if val != "" {
		if si, ok := sessions.Load(val); ok {
			return si.(*sharInfo), nil
		}
	}

	token := c.Query("tk")
	if token == "" {
		return nil, fiber.NewError(499, "No token specified")
	}

	pwd := c.Query("pwd")
	if pwd == "" {
		pwd = c.Get("x-pupcloud-pwd")
	}

	// XXX I use 499 because 401 plus a reverse proxy seems to trigger a Basic Authentication
	// prompt in the browser
	if pwd == "" {
		return nil, fiber.NewError(499, "Password required or wrong password")
	}

	tkIdx := commons.FindString(token, sharing.TokenNames)
	if tkIdx < 0 {
		return nil, fiber.NewError(fiber.StatusBadRequest, "Unknown token")
	}
	secret := sharing.TokenSecrets[tkIdx]
	password := pwd + "|" + secret

	x := c.Query("x")
	if x == "" {
		return nil, fiber.NewError(499, "No sharing details specified")
	}

	partialPath, readOnly, date, err := commons.DecryptSharingURL(password, x)
	if err != nil {
		return nil, fiber.NewError(499, err.Error())
	}

	sharinfo := sharInfo{filepath.Join(root, partialPath), readOnly}

	now, _ := strconv.Atoi(time.Now().Format("20170907"))

	if date != nil && uint32(now) > *date {
		return nil, fiber.NewError(499, "Link expired")
	}

	rnd := utils.UUIDv4()
	cookie := new(fiber.Cookie)
	cookie.Name = "pupcloud-sharing-session"
	cookie.Value = rnd
	cookie.Expires = time.Now().Add(24 * time.Hour)
	cookie.SessionOnly = true
	cookie.SameSite = "strict"
	c.Cookie(cookie)
	sessions.Store(rnd, &sharinfo)

	return &sharinfo, nil
}
