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
	"github.com/gofiber/fiber/v2"
	"github.com/proofrock/pupcloud/commons"
	"io/ioutil"
	"os"
	"path/filepath"
)

func FileExists(filename string) bool {
	info, err := os.Lstat(filename)
	return !os.IsNotExist(err) && !info.IsDir()
}

func cleanPath(path string, followLinks bool) (string, error) {
	var err error
	if followLinks {
		path, err = filepath.EvalSymlinks(path)
		if err != nil {
			return "", err
		}
	} else {
		path = filepath.Clean(path)
	}
	return path, nil
}

type Item struct {
	IsLink      bool   `json:"isLink"`
	MimeType    string `json:"mimeType"`
	Name        string `json:"name"`
	Size        int64  `json:"size"`
	ChDate      int64  `json:"chDate"`
	Owner       string `json:"owner"`
	Group       string `json:"group"`
	Permissions string `json:"permissions"`
}

func LsFile(path string, followLinks bool) *Item {
	info, errStating := os.Lstat(path)
	if os.IsNotExist(errStating) {
		return nil
	}

	var ret Item
	ret.Name = filepath.Base(path)
	ret.IsLink = false

	if info.IsDir() {
		ret.MimeType = "#directory"
		ret.Size = -1
	} else if info.Mode()&os.ModeSymlink != 0 {
		ret.IsLink = true
		if !followLinks {
			ret.MimeType = "#link"
			ret.Size = -1
		} else {
			resolved, errResolving := cleanPath(path, true)
			if errResolving != nil {
				ret.MimeType = "#unresolved"
				ret.Size = -1
			} else {
				target := LsFile(resolved, true)
				if target == nil {
					ret.MimeType = "#unresolved"
				} else {
					ret.MimeType = target.MimeType
					ret.Size = target.Size
				}
			}
		}
	} else {
		ret.MimeType = getFileContentType(path)
		ret.Size = info.Size()
	}

	ret.ChDate = info.ModTime().Unix()

	ret.Owner, ret.Group = getUserAndGroup(path)
	ret.Permissions = info.Mode().String()

	return &ret
}

func LsDir(path string, followLinks bool) ([]Item, *commons.ErrorRes) {
	var err error
	if followLinks {
		path, err = cleanPath(path, followLinks)
		if err != nil {
			return nil, &commons.ErrorRes{Code: fiber.StatusBadRequest, Message: err.Error()}
		}
	}

	file, errPath := os.Lstat(path)
	if errPath != nil || !file.IsDir() {
		return nil, &commons.ErrorRes{Code: fiber.StatusNotFound, Message: "Path not found"}
	}

	files, err := ioutil.ReadDir(path)
	var ret []Item
	for _, f := range files {
		item := LsFile(filepath.Join(path, f.Name()), followLinks)
		if item != nil {
			ret = append(ret, *item)
		}
	}
	return ret, nil
}
