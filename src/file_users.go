// +build !windows

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
	"os"
	"os/user"
	"strconv"
	"syscall"
)

// Adapted from https://pirivan.gitlab.io/post/how-to-retrieve-file-ownership-information-in-golang/
func getUserAndGroup(path string) (string, string) {
	fileInfo, err := os.Stat(path)
	if err != nil {
		return "--", "--"
	}

	stat, ok := fileInfo.Sys().(*syscall.Stat_t)
	if !ok {
		return "--", "--"
	}

	usr, err := user.LookupId(strconv.FormatUint(uint64(stat.Uid), 10))
	if err != nil {
		return "--", "--"
	}
	group, err := user.LookupGroupId(strconv.FormatUint(uint64(stat.Gid), 10))
	if err != nil {
		return "--", "--"
	}

	return fmt.Sprintf("%s (%s)", usr.Username, usr.Uid),
		fmt.Sprintf("%s (%s)", group.Name, group.Gid)
}