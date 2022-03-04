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
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

const MIME_TYPE_TEXT_PLAIN = "text/plain"

// Adapted from https://golangcode.com/get-the-content-type-of-file/
func getFileContentType(path string) string {
	// First, quick lookup by extension
	ext := filepath.Ext(path)
	if ext != "" {
		// IDK why, but .txt is not translated by Go :-(
		if strings.EqualFold(ext, ".txt") {
			return MIME_TYPE_TEXT_PLAIN
		}
		contentType := mime.TypeByExtension(ext)
		if contentType != "" {
			return contentType
		}
	}

	// If inconclusive, look up by contents
	file, err := os.Open(path)
	if err != nil {
		return MIME_TYPE_TEXT_PLAIN
	}
	defer file.Close()

	buffer := make([]byte, 512)

	_, err = file.Read(buffer)
	if err != nil {
		return MIME_TYPE_TEXT_PLAIN
	}

	contentType := http.DetectContentType(buffer)

	return contentType
}

func getFileInfoForHTTP(path string) (present bool, contentType string, length int64) {
	info, err := os.Stat(path)
	if os.IsNotExist(err) || info.IsDir() {
		return false, "", 0
	}

	length = info.Size()

	return true, getFileContentType(path), length
}
