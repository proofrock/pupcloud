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
package commons

import (
	"bytes"
	"encoding/binary"
	"github.com/proofrock/pupcloud/crypgo"
	"os"
)

type ErrorRes struct {
	Code    int    `json:"code"`
	Message string `json:"msg"`
}

func DirExists(filename string) bool {
	info, err := os.Stat(filename)
	return !os.IsNotExist(err) && info.IsDir()
}

func boolToBytes(b bool) byte {
	if b {
		return 1
	}
	return 0
}

func intToBytes(number uint32) []byte {
	var arr [4]byte
	binary.BigEndian.PutUint32(arr[0:4], number)
	return arr[:]
}

func bytesToInt(data []byte) uint32 {
	return binary.BigEndian.Uint32(data)
}

func EncryptSharingURL(profile, pwd, path string, readOnly bool, date *uint32) (string, error) {
	var b bytes.Buffer
	b.Write([]byte{boolToBytes(readOnly)})
	b.WriteString(path)
	b.Write([]byte{byte(0x00)})
	b.Write([]byte{boolToBytes(date != nil)})
	if date != nil {
		b.Write(intToBytes(*date))
	}
	return crypgo.EncryptBytes(pwd, b.Bytes(), []byte(profile))
}

func DecryptSharingURL(profile, pwd, encoded string) (path string, readOnly bool, date *uint32, err error) {
	plain, err := crypgo.DecryptBytes(pwd, encoded, []byte(profile))
	if err != nil {
		return
	}

	b := bytes.NewBuffer(plain)

	_readOnly, _ := b.ReadByte()
	readOnly = _readOnly == 1

	pathBytes, _ := b.ReadBytes(byte(0x00))
	path = string(pathBytes[:len(pathBytes)-1])

	if _hasDate, _ := b.ReadByte(); _hasDate == 1 {
		bDate := make([]byte, 4)
		b.Read(bDate)
		_date := bytesToInt(bDate)
		date = &_date
	}

	return
}
