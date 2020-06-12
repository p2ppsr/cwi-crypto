# Crypto

This module provides a common implementation for standard cryptographic utilities, ciphers, IV management, low-level promitives and operations.

## Exported Functions

Names                    | Description
-------------------------|-----------------------------
`encrypt` and `decrypt`  | Symmetric AES-GCM encryption with a 32-byte prepended IV and support for data encoded as a Uint8Array or a string
`XOR`                    | Bitwise Exclusive-OR between two Uint8Arrays of equal length
`keyFromString`          | Derives a CryptoKey from a string with PBKDF2 using a sane iteration count and the given salt

## API

### `encrypt(Uint8Array|string, CryptoKey, string) => Uint8Array|string`

### `decrypt(Uint8Array|string, CryptoKey, string) => Uint8Array|string`

### `keyFromString(string, Uint8Array) => CryptoKey`

### `XOR(Uint8Array, Uint8Array) => Uint8Array`

## Testing

While this is not a React application, the `react-scripts` package is used for testing. I tried to get Jest to work on its own with the Web Cryptography API, TextEncoder and TextDecoder, but 
was unable to find a suitable configuration. If anyone can get the tests to pass with only Jest, please feel free to create a pull request.

Adequate testing practices for use in a critical production application should be observed at all times for this library.

## Confidentiality

Peer-to-peer Privacy Systems Research proprietary and confidential.