/*
  Copyright (c) 2022-, Germano Rizzo <oss /AT/ germanorizzo /DOT/ it>

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted, provided that the above
  copyright notice and this permission notice appear in all copies.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

// copied here because I want to drop reliance on zstd, it's not used in this context and it complicates the build
// It uses "normal" ChaCha20Poly1305, for shorter results; it also removes header and compression bytes, here they
// aren't needed (further shortening the result).

package crypgo

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"golang.org/x/crypto/chacha20poly1305"
	"golang.org/x/crypto/scrypt"
)

const ivSize = chacha20poly1305.NonceSize
const keySize = chacha20poly1305.KeySize

const scryptSaltSize = 8
const scryptN = 1024
const scryptR = 8
const scryptP = 1

func Sha256(str string) string {
	hash := sha256.Sum256([]byte(str))
	return hex.EncodeToString(hash[:])
}

func pwdToKey(salt []byte, password string) ([]byte, error) {
	dk, err := scrypt.Key([]byte(password), salt, scryptN, scryptR, scryptP, keySize)
	if err != nil {
		return nil, err
	}
	return dk, nil
}

func EncryptBytes(password string, plainBytes, addData []byte) (string, error) {
	iv := make([]byte, ivSize)
	rand.Read(iv)

	salt := iv[:scryptSaltSize]

	key, err := pwdToKey(salt, password)
	if err != nil {
		return "", err
	}

	c, err := chacha20poly1305.New(key)
	if err != nil {
		return "", err
	}
	cypherBytes := c.Seal(nil, iv, plainBytes, addData)

	outBytes := append(iv, cypherBytes...)

	return base64.RawURLEncoding.EncodeToString(outBytes), nil
}

// This function receives a password and a cypher text (as produced by one of the *EncryptBytes methods)
// and decodes the original plaintext (if the password is the one used for encryption).
//
// It will return it or an eventual error, and closes all related resources.
// XChaCha20-Poly1305's authentication tag is used to detect any decryption error. It also
// transparently decompress data, if needed.
func DecryptBytes(password string, base64CipherText string, addData []byte) ([]byte, error) {
	inBytes, err := base64.RawURLEncoding.DecodeString(base64CipherText)
	if err != nil {
		return make([]byte, 0), err
	}

	iv := inBytes[:ivSize]
	salt := inBytes[:scryptSaltSize]
	cypherBytes := inBytes[ivSize:]

	key, err := pwdToKey(salt, password)
	if err != nil {
		return make([]byte, 0), err
	}

	c, err := chacha20poly1305.New(key)
	if err != nil {
		return make([]byte, 0), err
	}
	plainBytes, err := c.Open(nil, iv, cypherBytes, addData)

	if err != nil {
		return make([]byte, 0), err
	}

	return plainBytes, nil
}
