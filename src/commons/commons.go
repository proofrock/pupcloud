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
	"encoding/base64"
	"encoding/binary"
	"os"

	"github.com/proofrock/crypgo"
)

type ErrorRes struct {
	Code    int    `json:"code"`
	Message string `json:"msg"`
}

func FileExists(filename string) bool {
	info, err := os.Stat(filename)
	if os.IsNotExist(err) {
		return false
	}
	return !info.IsDir()
}

// TODO generics here, see https://stackoverflow.com/questions/38654383/how-to-search-for-an-element-in-a-golang-slice
func FindString(str string, slice []string) int {
	for i, v := range slice {
		if v == str {
			return i
		}
	}
	return -1
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

func EncryptSharingURL(pwd, path string, readOnly bool, date *uint32) (string, error) {
	crypgo.SetVariant(base64.URLEncoding)
	defer crypgo.SetVariant(base64.StdEncoding)
	var b bytes.Buffer
	b.Write([]byte{boolToBytes(readOnly)})
	b.WriteString(path)
	b.Write([]byte{byte(0x00)})
	b.Write([]byte{boolToBytes(date != nil)})
	if date != nil {
		b.Write(intToBytes(*date))
	}
	return crypgo.CompressAndEncryptBytes(pwd, b.Bytes(), 19)
}

func DecryptSharingURL(pwd, encoded string) (path string, readOnly bool, date *uint32, err error) {
	crypgo.SetVariant(base64.URLEncoding)
	defer crypgo.SetVariant(base64.StdEncoding)

	plain, err := crypgo.DecryptBytes(pwd, encoded)
	if err != nil {
		return
	}

	b := bytes.NewBuffer(plain)

	_readOnly, _ := b.ReadByte()
	readOnly = _readOnly == 1

	path, _ = b.ReadString(byte(0x00))

	if _hasDate, _ := b.ReadByte(); _hasDate == 1 {
		bDate := make([]byte, 4)
		b.Read(bDate)
		_date := bytesToInt(bDate)
		date = &_date
	}

	return
}
