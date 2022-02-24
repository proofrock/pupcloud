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
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	flag "github.com/spf13/pflag"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/proofrock/pupcloud/commons"
)

const Version = "v0.0.1"

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

	return ctx.Status(code).JSON(commons.ErrorRes{Code: code, Message: msg})
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

type featuRes struct {
	Version string `json:"version"`
	Title   string `json:"title"`
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

	flag.Parse()

	if *root == "" {
		println("ERROR: You must specify a root (-r)")
		os.Exit(-1)
	}
	println(fmt.Sprintf(" - Serving dir %s", *root))

	app := fiber.New(
		fiber.Config{
			ErrorHandler:          errHandler,
			DisableStartupMessage: true,
		},
	)

	app.Use(compress.New())

	app.Get("/features", features(*title))
	app.Get("/ls", ls(*root))
	app.Get("/file", file(*root))

	subFS, _ := fs.Sub(static, "static")
	app.Use("/", filesystem.New(filesystem.Config{
		Root: http.FS(subFS),
	}))

	println(fmt.Sprintf(" - Server running on port %d", *port))
	log.Fatal(app.Listen(fmt.Sprintf("%s:%d", *bindTo, *port)))
}

func features(title string) func(c *fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		return c.JSON(featuRes{Version, title})
	}
}

func ls(root string) func(c *fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
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
}

// Adapted from https://github.com/gofiber/fiber/blob/master/middleware/filesystem/filesystem.go
func file(root string) func(c *fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		path := c.Query("path")
		forDownload := c.Query("dl", "0") == "1"
		if path == "" {
			return fiber.ErrNotFound
		}

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
}
