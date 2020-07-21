# Crypto

This module provides a common implementation for standard cryptographic utilities, ciphers, IV management, low-level promitives and operations.

## Exported Functions

Names                    | Description
-------------------------|-----------------------------
`encrypt` and `decrypt`  | Symmetric AES-GCM encryption with a 32-byte prepended IV and support for data encoded as a Uint8Array or a string
`XOR`                    | Bitwise Exclusive-OR between two Uint8Arrays of equal length
`keyFromString`          | Derives a CryptoKey from a string with PBKDF2 using a sane iteration count and the given salt

## API

### `encrypt(plaintext: Uint8Array|string, key: CryptoKey, returnType: string) => ciphertext: Uint8Array|string`

Encrypts the given plaintext with the given key. Returns the ciphertext.

#### Parameters

Name       | Description
-----------|-------------
plaintext  | The data to encrypt. May be a String or a Uint8Array
key        | The CryptoKey object to use for the encryption operation
returnType | A string indicating the desired return type. May be either `string` (default) or `Uint8Array`

#### Return Value

The function will either return a string or a Uint8Array representing the ciphertext, depending on the value of `returnType`.

### `decrypt(ciphertext: Uint8Array|string, key: CryptoKey, returnType: string) => plaintext: Uint8Array|string`

Decrypts the given ciphertext with the given key. Returns the plaintext.

#### Parameters

Name       | Description
-----------|-------------
ciphertext | The data to decrypt. May be a String or a Uint8Array
key        | The CryptoKey object to use for the decryption operation
returnType | A string indicating the desired return type. May be either `string` (default) or `Uint8Array`

#### Return Value

The function will either return a string or a Uint8Array representing the plaintext, depending on the value of `returnType`.

### `keyFromString({ string: String, salt: Uint8Array }) => key: CryptoKey`

Derives a suitable CryptoKey from the password string with PBKDF2 and the given salt.

#### Parameters

Name       | Description
-----------|-------------
string     | The password string to use
salt       | a Uint8Array representing the password salt to use

#### Return Value

The function will return a `CryptoKey` object representing the derived key.

### `XOR(k1: Uint8Array, k2: Uint8Array) => result: Uint8Array`

Performs a bitwise exclusive OR operation with the given data. Returns the result. Inputs must be the same length.

#### Parameters

Name    | Description
--------|-------------
k1      | A Uint8Array representing the first input to XOR
k2      | A Uint8Array representing the second input to XOR

#### Return Value

The function will return a `Uint8Array` containing the output data.

## Testing

While this is not a React application, the `react-scripts` package is used for testing. I tried to get Jest to work on its own with the Web Cryptography API, TextEncoder and TextDecoder, but 
was unable to find a suitable configuration. If anyone can get the tests to pass with only Jest, please feel free to create a pull request.

Adequate testing practices for use in a critical production application should be observed at all times for this library.

## Confidentiality

Peer-to-peer Privacy Systems Research proprietary and confidential.