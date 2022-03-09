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
	"math/big"
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

func BoolToBytes(b bool) byte {
	if b {
		return 1
	}
	return 0
}

func Int64ToBytes(number int64) []byte {
	big := new(big.Int)
	big.SetInt64(number)
	return big.Bytes()
}

func EncryptSharingURL(pwd, path string, readOnly bool, date int64) (string, error) {
	crypgo.SetVariant(base64.URLEncoding)
	var b bytes.Buffer
	b.Write([]byte{BoolToBytes(readOnly)})
	b.WriteString(path)
	b.Write(Int64ToBytes(date))
	return crypgo.CompressAndEncryptBytes(pwd, b.Bytes(), 19)
}
