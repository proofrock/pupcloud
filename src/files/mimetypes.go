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

package files

import (
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
)

const mimeTypeTextPlain = "text/plain"

var fileNames sync.Map
var fileExts sync.Map

func init() {
	fileNames.Store("Dockerfile", mimeTypeTextPlain)
	fileNames.Store("Makefile", mimeTypeTextPlain)
	fileNames.Store("LICENSE", mimeTypeTextPlain)
	fileNames.Store(".gitignore", mimeTypeTextPlain)

	fileExts.Store("txt", mimeTypeTextPlain)
	fileExts.Store("md", "text/markdown")
}

// Adapted from https://golangcode.com/get-the-content-type-of-file/
func getFileContentType(path string) string {
	base := filepath.Base(path)
	ext := strings.ToLower(filepath.Ext(path))

	// First, local resolution
	if val, ok := fileNames.Load(base); ok {
		return val.(string)
	}
	if val, ok := fileExts.Load(ext); ok {
		return val.(string)
	}

	// Lookup with Go extensions resolutor
	if ext != "" {
		contentType := mime.TypeByExtension(ext)
		if contentType != "" {
			return contentType
		}
	}

	// If inconclusive, look up by contents
	file, err := os.Open(path)
	if err != nil {
		return mimeTypeTextPlain
	}
	defer file.Close()

	buffer := make([]byte, 512)

	_, err = file.Read(buffer)
	if err != nil {
		return mimeTypeTextPlain
	}

	contentType := http.DetectContentType(buffer)

	return contentType
}
