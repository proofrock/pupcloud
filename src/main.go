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
	"embed"
	"fmt"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/proofrock/pupcloud/commons"
	"github.com/proofrock/pupcloud/crypgo"
	filess "github.com/proofrock/pupcloud/files"
	"golang.org/x/exp/slices"
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

const Version = "v0.7.2"

const MiB = 1024 * 1024

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

type res struct {
	Path  []string      `json:"path"`
	Items []filess.Item `json:"items"`
}

type sharing struct {
	Allowed        bool     `json:"-"`
	ProfileNames   []string `json:"profiles"`
	ProfileSecrets []string `json:"-"`
	Prefix         string   `json:"-"`
}

func main() {
	year := time.Now().Year()
	if year == 2022 {
		fmt.Println(fmt.Sprintf("Pupcloud %s (c) 2022 Germano Rizzo", Version))
	} else {
		fmt.Println(fmt.Sprintf("Pupcloud %s (c) 2022-%d Germano Rizzo", Version, year))
	}

	rootDir := flag.StringP("root", "r", "", "The document root to serve")
	bindTo := flag.String("bind-to", "0.0.0.0", "The address to bind to")
	port := flag.IntP("port", "p", 17178, "The port to run on")
	title := flag.String("title", "🐶 Pupcloud", "Title of the window")
	pwd := flag.StringP("password", "P", "", "The main access password, if desired. Use --pwd-hash for a safer alternative")
	pwdHash := flag.StringP("pwd-hash", "H", "", "SHA256 hash of the main access password, if desired")
	readOnly := flag.Bool("readonly", false, "DEPRECATED: no effect, default is read only. Kept for backwards compatibility.")
	allowEdits := flag.BoolP("allow-edits", "E", false, "Allows changes to FS (default: don't)")
	shareProfiles := flag.StringArray("share-profile", []string{}, "Profile for sharing, in the form name:secret, multiple profiles allowed")
	shareProfilesCSV := flag.String("share-profiles", "", "Profiles for sharing, in the form name:secret, multiple profiles comma-separated")
	sharePrefix := flag.String("share-prefix", "", "The base URL of the sharing interface (default: 'http://localhost:' + the port)")
	sharePort := flag.Int("share-port", 17179, "The port of the sharing interface")
	uploadSize := flag.Int("max-upload-size", 32, "The max size of an upload, in MiB")
	allowRoot := flag.Bool("allow-root", false, "Allow launching as root (default: don't)")
	followLinks := flag.Bool("follow-symlinks", false, "Follow symlinks when traversing directories (default: don't)")

	flag.Parse()

	// If env vars are specified, overwrite the flags

	if _rootDir, present := os.LookupEnv("PUP_ROOT"); present {
		rootDir = &_rootDir
	}
	if _bindTo, present := os.LookupEnv("PUP_BIND_TO"); present {
		bindTo = &_bindTo
	}
	if _strPort, present := os.LookupEnv("PUP_PORT"); present {
		_port, err := strconv.Atoi(_strPort)
		if err != nil {
			commons.Abort("ERROR: env var PUP_PORT should be an integer")
		}
		port = &_port
	}
	if _title, present := os.LookupEnv("PUP_TITLE"); present {
		title = &_title
	}
	if _pwd, present := os.LookupEnv("PUP_PASSWORD"); present {
		pwd = &_pwd
	}
	if _pwdHash, present := os.LookupEnv("PUP_PWD_HASH"); present {
		pwdHash = &_pwdHash
	}
	if _allowEdits, present := os.LookupEnv("PUP_ALLOW_EDITS"); present {
		if _allowEdits == "1" {
			ae := true
			allowEdits = &ae
		}
	}
	if _shareProfilesCSV, present := os.LookupEnv("PUP_SHARE_PROFILES"); present {
		shareProfilesCSV = &_shareProfilesCSV
	}
	if _sharePrefix, present := os.LookupEnv("PUP_SHARE_PREFIX"); present {
		sharePrefix = &_sharePrefix
	}
	if _strSharePort, present := os.LookupEnv("PUP_SHARE_PORT"); present {
		_sharePort, err := strconv.Atoi(_strSharePort)
		if err != nil {
			commons.Abort("ERROR: env var PUP_SHARE_PORT should be an integer")
		}
		sharePort = &_sharePort
	}
	if _strUploadSize, present := os.LookupEnv("PUP_MAX_UPLOAD_SIZE"); present {
		_uploadSize, err := strconv.Atoi(_strUploadSize)
		if err != nil {
			commons.Abort("ERROR: env var PUP_MAX_UPLOAD_SIZE should be an integer")
		}
		uploadSize = &_uploadSize
	}
	if _allowRoot, present := os.LookupEnv("PUP_ALLOW_ROOT"); present {
		if _allowRoot == "1" {
			ar := true
			allowRoot = &ar
		}
	}
	if _followLinks, present := os.LookupEnv("PUP_FOLLOW_SYMLINKS"); present {
		if _followLinks == "1" {
			fl := true
			followLinks = &fl
		}
	}

	// let's continue

	if *readOnly {
		fmt.Fprint(os.Stdout, "WARNING: --readonly is deprecated and will be removed")
	}

	if *pwd != "" && *pwdHash != "" {
		commons.Abort("ERROR: cannot specify both a password and a hashed password")
	}

	if os.Geteuid() == 0 && !*allowRoot {
		commons.Abort("ERROR: running as root is forbidden; use --allow-root if you are really sure")
	}

	if *rootDir == "" {
		commons.Abort("ERROR: you must specify a root dir (-r)")
	}

	if !commons.DirExists(*rootDir) {
		commons.Abort("ERROR: root dir must exist")
	}

	var err error
	*rootDir, err = filepath.Abs(*rootDir)
	if err != nil {
		commons.Abort("ERROR: cannot make root dir absolute")
	}

	sharing := sharing{}

	if *sharePrefix != "" {
		if !(strings.HasPrefix(*sharePrefix, "http://") || strings.HasPrefix(*sharePrefix, "https://")) ||
			strings.HasSuffix(*sharePrefix, "/") {
			commons.Abort(
				"ERROR: malformed '--share-prefix': protocol must be http or https, and it must not end with a '/'",
			)
		}
	} else {
		*sharePrefix = fmt.Sprintf("http://localhost:%d", *sharePort)
	}

	if *shareProfilesCSV != "" {
		if len(*shareProfiles) > 0 {
			commons.Abort("ERROR: cannot specify both '--share-profile' and '--share-profiles'")
		}
		_shareProfiles := strings.Split(*shareProfilesCSV, ",")
		shareProfiles = &_shareProfiles
	}

	if len(*shareProfiles) > 0 {
		sharing.Allowed = true
		sharing.Prefix = *sharePrefix
		for i, tok := range *shareProfiles {
			pos := strings.Index(tok, ":")
			if pos < 0 {
				commons.Abort(fmt.Sprintf("ERROR: malformed profile #%d: it must have a ':'", i+1))
			}
			sharing.ProfileNames = append(sharing.ProfileNames, tok[0:pos])
			sharing.ProfileSecrets = append(sharing.ProfileSecrets, tok[pos+1:])
		}
	}

	fmt.Println(fmt.Sprintf(" - Serving dir %s", *rootDir))
	if *allowEdits {
		fmt.Println("   + Read Only")
	} else {
		fmt.Println("   + Read/Write")
	}
	if *pwdHash != "" {
		fmt.Println("   + With hashed password")
	} else if *pwd != "" {
		fmt.Println("   + With password")
	} else {
		fmt.Println("   + Without password")
	}
	fmt.Println("   + With max upload size:", *uploadSize, "MiB")
	if *followLinks {
		fmt.Println("   + Will follow symbolic links")
	} else {
		fmt.Println("   + Will NOT follow symbolic links")
	}

	if sharing.Allowed {
		fmt.Println(" - Sharing enabled")
		fmt.Println("   + With profiles:", strings.Join(sharing.ProfileNames, ", "))
		fmt.Println("   + At", sharing.Prefix)
		go launchSharingApp(*bindTo, *rootDir, *title, *sharePort, *uploadSize, !*allowEdits, *followLinks, &sharing)
		time.Sleep(1 * time.Second)
	}

	launchMainApp(*bindTo, *rootDir, *title, *pwd, *pwdHash, *port, *uploadSize, !*allowEdits, *followLinks, &sharing)
}

// FIXME limit growth
var sessions sync.Map
var authFailureMutex sync.Mutex

func launchMainApp(bindTo, root, title, pwd, pwdHash string, port, uploadSize int, readOnly, followLinks bool, sharing *sharing) {
	app := fiber.New(
		fiber.Config{
			ErrorHandler:          errHandler,
			DisableStartupMessage: true,
			BodyLimit:             uploadSize * MiB,
			Network:               fiber.NetworkTCP,
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
		if err := doAuth4MainApp(c, root, pwd, pwdHash); err != nil {
			return err
		}

		c.Locals("root", root)
		c.Locals("title", title)
		c.Locals("readOnly", readOnly)
		c.Locals("sharing", sharing)
		c.Locals("maxRequestSize", uploadSize*MiB)
		c.Locals("hasPassword", pwdHash != "" || pwd != "")
		c.Locals("followLinks", followLinks)
		return c.Next()
	})

	app.Get("/features", features)
	app.Get("/ls", ls)
	app.Get("/file", file)
	app.Get("/logout", logout)
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
	}

	time.Sleep(1 * time.Second)

	fmt.Println(fmt.Sprintf(" - Server running on port %d", port))
	log.Fatal(app.Listen(fmt.Sprintf("%s:%d", bindTo, port)))
}

func doAuth4MainApp(c *fiber.Ctx, root, pwd, pwdHash string) error {
	if pwdHash == "" && pwd == "" {
		return nil
	}

	pwdHash = strings.ToLower(pwdHash)

	val := c.Cookies("pupcloud-session")
	if val != "" {
		if _, ok := sessions.Load(val); ok {
			return nil
		}

		if !commons.DirExists(root) {
			return fiber.NewError(498, "Folder doesn't exist anymore")
		}
	}

	pwdFromWeb := c.Get("x-pupcloud-pwd")

	// XXX I use 499 because 401 plus a reverse proxy seems to trigger a Basic Authentication
	// prompt in the browser
	if pwdFromWeb == "" {
		return fiber.NewError(499, "Password required")
	}

	auth := false
	if pwdHash != "" {
		auth = strings.HasPrefix(crypgo.Sha256(pwdFromWeb), strings.ToLower(pwdHash))
	} else {
		auth = pwdFromWeb == pwd
	}

	if !auth {
		authFailureMutex.Lock()
		defer authFailureMutex.Unlock()
		time.Sleep(1 * time.Second)
		return fiber.NewError(499, "Wrong password")
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
	root        string
	path        string
	hasPassword bool
	readOnly    bool
	expiry      *uint32
}

func launchSharingApp(bindTo, root, title string, port, uploadSize int, globalReadOnly, followLinks bool, sharing *sharing) {
	app := fiber.New(
		fiber.Config{
			ErrorHandler:          errHandler,
			DisableStartupMessage: true,
			BodyLimit:             uploadSize * MiB,
			Network:               fiber.NetworkTCP,
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
		sharinfo, err := doAuth4SharingApp(c, root, globalReadOnly, sharing)
		if err != nil {
			return err
		}

		if sharinfo.path != "/" && strings.HasSuffix(sharinfo.path, "/") {
			sharinfo.path = sharinfo.path[:len(sharinfo.path)-2]
		}
		c.Locals("root", sharinfo.path)
		c.Locals("title", title)
		c.Locals("readOnly", sharinfo.readOnly)
		c.Locals("maxRequestSize", uploadSize*MiB)
		c.Locals("hasPassword", sharinfo.hasPassword)
		c.Locals("followLinks", followLinks)
		return c.Next()
	})

	app.Get("/features", features)
	app.Get("/ls", ls)
	app.Get("/file", file)
	app.Get("/logout", logoutSharing)
	app.Delete("/fsOps/del", fsDel)
	app.Post("/fsOps/rename", fsRename)
	app.Post("/fsOps/move", fsMove)
	app.Post("/fsOps/copy", fsCopy)
	app.Put("/fsOps/newFolder", fsNewFolder)
	app.Put("/fsOps/upload", fsUpload)

	fmt.Println(fmt.Sprintf(" - Sharing server running on port %d", port))
	log.Fatal(app.Listen(fmt.Sprintf("%s:%d", bindTo, port)))
}

func doAuth4SharingApp(c *fiber.Ctx, root string, globalReadOnly bool, sharing *sharing) (*sharInfo, error) {
	now, _ := strconv.Atoi(time.Now().Format("20170907"))

	val := c.Cookies("pupcloud-sharing-session")
	if val != "" {
		if si, ok := sessions.Load(val); ok {
			sinfo := si.(*sharInfo)
			if sinfo.expiry != nil && uint32(now) > *sinfo.expiry {
				return nil, fiber.NewError(498, "Link expired")
			}

			if !commons.DirExists(sinfo.path) {
				return nil, fiber.NewError(498, "Shared folder doesn't exist anymore")
			}

			if sinfo.root != root {
				return nil, fiber.NewError(498, "Root has changed")
			}

			return si.(*sharInfo), nil
		}
	}

	profile := c.Query("p")
	if profile == "" {
		return nil, fiber.NewError(498, "No profile specified")
	}

	pwd := c.Query("pwd")
	if pwd == "" {
		pwd = c.Get("x-pupcloud-pwd")
	}

	// XXX I use 499/498 because 401 plus a reverse proxy seems to trigger a Basic Authentication
	// prompt in the browser

	prfIdx := slices.Index(sharing.ProfileNames, profile)
	if prfIdx < 0 {
		return nil, fiber.NewError(498, "Unknown profile")
	}
	secret := sharing.ProfileSecrets[prfIdx]

	var password string
	if pwd != "" {
		password = pwd + "|" + secret
	} else {
		password = secret
	}

	if c.Query("r") != crypgo.Sha256(root)[:6] {
		return nil, fiber.NewError(498, "Server root dir changed")
	}

	x := c.Query("x")
	if x == "" {
		return nil, fiber.NewError(498, "No sharing details specified")
	}

	partialPath, readOnly, date, err := commons.DecryptSharingURL(profile, password, root, x)
	readOnly = readOnly || globalReadOnly
	if err != nil {
		authFailureMutex.Lock()
		defer authFailureMutex.Unlock()
		time.Sleep(1 * time.Second)
		return nil, fiber.NewError(499, "Wrong password or invalid address")
	}

	sharinfo := sharInfo{
		root,
		filepath.Join(root, partialPath),
		pwd != "",
		readOnly,
		date,
	}

	if date != nil && uint32(now) > *date {
		return nil, fiber.NewError(499, "Link expired")
	}

	if !commons.DirExists(sharinfo.path) {
		return nil, fiber.NewError(499, "Shared folder doesn't exist anymore")
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
