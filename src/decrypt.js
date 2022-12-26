import { decodeUint8FromString } from 'cwi-array-encoding'

/**
 * Decrypts the given ciphertext
 * @param {string} ciphertext ciphertext to decrypt
 * @param {CryptoKey} key key to use, defaults to the primary key
 * @param {string} returnType defaults to 'string', can also be 'Uint8Array'
 */
const decrypt = async (ciphertext, key, returnType = 'string') => {
  if (typeof ciphertext === 'undefined') {
    throw new Error('ciphertext is a required parameter!')
  }
  if (typeof ciphertext !== 'string' && ciphertext.constructor !== Uint8Array) {
    throw new TypeError(`ciphertext must be either a string or a Uint8Array, but ${typeof ciphertext} was given!`)
  }
  if (typeof key === 'undefined') {
    throw new Error('key is a required parameter!')
  }

  let ciphertextWithIvBuffer
  if (ciphertext.constructor === Uint8Array) {
    ciphertextWithIvBuffer = ciphertext
  } else {
    ciphertextWithIvBuffer = decodeUint8FromString(ciphertext)
  }
  const ivBuffer = ciphertextWithIvBuffer.slice(0, 32)
  const ciphertextBuffer = ciphertextWithIvBuffer.slice(32)
  try {
    const plaintext = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBuffer
      },
      key,
      ciphertextBuffer
    )
    if (returnType === 'string') {
      return new TextDecoder().decode(new Uint8Array(plaintext))
    } else if (returnType === 'Uint8Array') {
      return new Uint8Array(plaintext)
    } else {
      throw new Error(
        `returnType must be either string or Uint8Array, but ${
          returnType
        } was given!`
      )
    }
  } catch (e) {
    throw new Error('Decryption failed!')
  }
}

export default decrypt
