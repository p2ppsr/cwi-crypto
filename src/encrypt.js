import {
  encodeUint8AsString,
  decodeUint8FromString
} from 'cwi-array-encoding'

const encrypt = async (plaintext, key, returnType = 'string') => {
  if (typeof plaintext === 'undefined') {
    throw new Error('plaintext is a required parameter!')
  }
  if (typeof plaintext !== 'string' && plaintext.constructor !== Uint8Array) {
    throw new TypeError(`plaintext must be a string or Uint8Array, but ${typeof plaintext} was given!`)
  }
  if (typeof key === 'undefined') {
    throw new Error('key is a required parameter!')
  }

  // Plaintext is converted to a Uint8Array if it is not given as one
  const plaintextBuffer = typeof plaintext === 'string'
    ? new TextEncoder().encode(plaintext)
    : plaintext
  const ivBuffer = crypto.getRandomValues(new Uint8Array(32))
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: ivBuffer
    },
    key,
    plaintextBuffer
  ))
  const ivWithCiphertext = new Uint8Array(
    ivBuffer.byteLength + ciphertext.byteLength
  )
  ivWithCiphertext.set(ivBuffer, 0)
  ivWithCiphertext.set(ciphertext, ivBuffer.byteLength)
  if (returnType === 'string') {
    return encodeUint8AsString(ivWithCiphertext)
  } else if (returnType === 'Uint8Array') {
    return ivWithCiphertext
  } else {
    throw new Error(`returnType must be either string or Uint8Array, but ${returnType} was given!`)
  }
}

export default encrypt
