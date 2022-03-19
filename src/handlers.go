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
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/proofrock/pupcloud/commons"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/otiai10/copy"
)

type featuRes struct {
	Version        string   `json:"version"`
	Title          string   `json:"title"`
	ReadOnly       bool     `json:"readonly"`
	MaxRequestSize int      `json:"maxReqSize"`
	Sharing        *sharing `json:"sharing,omitempty"`
}

func features(c *fiber.Ctx) error {
	var shar *sharing

	shInterface := c.Locals("sharing")
	if shInterface != nil && shInterface.(*sharing).Allowed {
		shar = shInterface.(*sharing)
	}

	return c.Status(200).JSON(featuRes{
		Version:        Version,
		Title:          c.Locals("title").(string),
		ReadOnly:       c.Locals("readOnly").(bool),
		MaxRequestSize: c.Locals("maxRequestSize").(int),
		Sharing:        shar,
	})
}

func ls(c *fiber.Ctx) error {
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
	return c.Status(200).JSON(res)
}

// Adapted from https://github.com/gofiber/fiber/blob/master/middleware/filesystem/filesystem.go
func file(c *fiber.Ctx) error {
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

	return c.Status(200).SendFile(fullPath)
}

func shareLink(c *fiber.Ctx) error {
	sharing := c.Locals("sharing").(*sharing)

	pwd := c.Query("pwd")
	if pwd == "" {
		return fiber.NewError(fiber.StatusBadRequest, "'pwd' not specified")
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
	if _expiry != "" {
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

	return c.Status(200).SendString(fmt.Sprintf("%s/?x=%s&tk=%s", sharing.Prefix, ret, token))
}

func fsDel(c *fiber.Ctx) error {
	if c.Locals("readOnly").(bool) {
		return fiber.NewError(fiber.StatusForbidden, "Read-only mode enabled")
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

	path := c.Query("path")
	if path == "" {
		return fiber.ErrBadRequest
	}

	root := c.Locals("root").(string)

	fullPath := filepath.Join(root, path)

	if commons.FileExists(fullPath) {
		return fiber.NewError(fiber.StatusBadRequest, "File already exists")
	}

	if err := os.Mkdir(fullPath, os.FileMode(0755)); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.SendStatus(200)
}

func fsUpload(c *fiber.Ctx) error {
	if c.Locals("readOnly").(bool) {
		return fiber.NewError(fiber.StatusForbidden, "Read-only mode enabled")
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
