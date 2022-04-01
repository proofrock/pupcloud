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
// format is the same, event with the unused compression byte, for interoperability

// Version 1.1.0

package crypgo

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"golang.org/x/crypto/chacha20poly1305"
	"golang.org/x/crypto/scrypt"
)

const format byte = 1

const ivSize = chacha20poly1305.NonceSize
const keySize = chacha20poly1305.KeySize

const scryptSaltSize = 8
const scryptN = 1024
const scryptR = 8
const scryptP = 1

var base64Variant = base64.StdEncoding

// Sets a Base64 variant, for example base64.URLEncoding for
// URL_safe encoding.
func SetVariant(variant *base64.Encoding) {
	base64Variant = variant
}

func pwdToKey(salt []byte, password string) ([]byte, error) {
	dk, err := scrypt.Key([]byte(password), salt, scryptN, scryptR, scryptP, keySize)
	if err != nil {
		return nil, err
	}
	return dk, nil
}

func genBytes(size int) []byte {
	ret := make([]byte, size)
	rand.Read(ret)
	return ret
}

// This function receives a password and a a byte array and produces a string
// with their encryption. Returns it, or an eventual error, and closes all related resources.
//
// More in detail:
//
// - generates a key derived from the password, using SCrypt;
//
// - encrypts the data with the key using XChaCha20-Poly1305, with an authentication tag.
//
// No compression is performed.
//
// The output string is the output data, Base64-encoded. It contains:
//
// - an header with the format version and information on whether data were encrypted or not;
//
// - an array of random bytes, used as the Salt for SCrypt and IV for XChaCha;
//
// - encrypted data;
//
// - an authentication tag, part of the output of XChaCha20-Poly1305, used to verify the integrity when decrypting.
func EncryptBytes(password string, plainBytes []byte) (string, error) {
	header := []byte{format, 0}

	iv := genBytes(ivSize)
	salt := iv[:scryptSaltSize]

	key, err := pwdToKey(salt, password)
	if err != nil {
		return "", err
	}

	c, err := chacha20poly1305.New(key)
	if err != nil {
		return "", err
	}
	cypherBytes := c.Seal(nil, iv, plainBytes, header)

	outBytes := append(header, append(iv, cypherBytes...)...)

	return base64Variant.EncodeToString(outBytes), nil
}

// This function receives a password and a cypher text (as produced by one of the *EncryptBytes methods)
// and decodes the original plaintext (if the password is the one used for encryption).
//
// It will return it or an eventual error, and closes all related resources.
// XChaCha20-Poly1305's authentication tag is used to detect any decryption error. It also
// transparently decompress data, if needed.
func DecryptBytes(password string, base64CipherText string) ([]byte, error) {
	inBytes, err := base64Variant.DecodeString(base64CipherText)
	if err != nil {
		return make([]byte, 0), err
	}

	header := inBytes[:2]

	if header[0] != format {
		return make([]byte, 0), errors.New("unknown format")
	}

	iv := inBytes[2 : ivSize+2]
	salt := inBytes[2 : scryptSaltSize+2]
	cypherBytes := inBytes[2+ivSize:]

	key, err := pwdToKey(salt, password)
	if err != nil {
		return make([]byte, 0), err
	}

	c, err := chacha20poly1305.New(key)
	if err != nil {
		return make([]byte, 0), err
	}
	plainBytes, err := c.Open(nil, iv, cypherBytes, header)

	if err != nil {
		return make([]byte, 0), err
	}

	return plainBytes, nil
}
