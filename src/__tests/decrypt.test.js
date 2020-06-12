import decrypt from '../decrypt'
import encrypt from '../encrypt'
import { ValidationError } from '@p2ppsr/standard-errors'
import vectors from './encryption.vectors'

const KEYS = [
  'WpDVnYKRl5g6VNiH/eotxMOAmPALoxEPJkVjO26hFFg=',
  'usasSS9U18mX+twb5ZOkrOJuzfN9MLOtEvNAd/smKeQ=',
  'U9zcbqamkQrzWkhwj0kijg5mYeqIVDUIDLq8WOahTxA='
]
const getKey = async i => {
  return crypto.subtle.importKey(
    'raw',
    await decodeUint8FromString(KEYS[i - 1]),
    { name: 'AES-GCM' },
    true,
    ['encrypt', 'decrypt']
  )
}

const PLAINTEXT_1 = 'hello there'
const CIPHERTEXT_1 = 'jI0lNI39UkC+gzIVoSMXPGSRl3mriEWnAKRSAxFQTBaK3i1LcozFOiVPCrqFfKr2r5dFOsL/YUh9DVI='

describe('decrypt', () => {
  it('Throws a ValidationError if ciphertext is not provided', async () => {
    expect(decrypt(undefined, await getKey(1))).rejects.toThrow(ValidationError)
  })
  it('Throws a TypeError if ciphertext is not a string or Uint8Array', async () => {
    expect(decrypt(
      ['ar', 'ray'],
      await getKey(1)
    )).rejects.toThrow(TypeError)
    expect(decrypt(
      {ob: 'ject'},
      await getKey(1)
    )).rejects.toThrow(TypeError)
  })
  it('Throws a ValidationError if the given key is not a CryptoKey', () => {
    expect(decrypt(
      CIPHERTEXT_1,
      { not: 'a', cryptokey: 'object' }
    )).rejects.toThrow(new ValidationError(
      'Invalid key: cryptoKey must have a kty property!'
    ))
  })
  it('Throws a ValidationError if no key is provided', () => {
    expect(decrypt(
      CIPHERTEXT_1,
      undefined
    )).rejects.toThrow(new ValidationError(
      'key is a required parameter!'
    ))
  })
  it('Decrypts a correctly-encrypted value', async () => {
    const result = await decrypt(CIPHERTEXT_1, await getKey(1))
    expect(result).toEqual(PLAINTEXT_1)
  })
  it('Returns the decrypted value as a Uint8Array when appropriate', async () => {
    const result = await decrypt(CIPHERTEXT_1, await getKey(1), 'Uint8Array')
    expect(result.constructor === Uint8Array).toBe(true)
  })
  it('Throws a useful error when decryption fails', async () => {
    expect(decrypt(
      CIPHERTEXT_1,
      await getKey(2)
    )).rejects.toThrow('Decryption failed!')
  })
  it('decrypts values encrypted with the encrypt function', async () => {
    const originalValue = 'secret value'
    const encryptedValue = await encrypt(originalValue, await getKey(2))
    const decryptedValue = await decrypt(encryptedValue, await getKey(2))
    expect(originalValue).toEqual(decryptedValue)
  })
  it('Can decrypt Uint8Array ciphertexts', async () => {
    const originalValue = 'secret value'
    const encryptedValue = await encrypt(
      originalValue,
      await getKey(2),
      'Uint8Array'
    )
    expect(encryptedValue.constructor).toEqual(Uint8Array)
    const decryptedValue = await decrypt(encryptedValue, await getKey(2))
    expect(originalValue).toEqual(decryptedValue)
  })
  vectors.forEach((vector, index) => {
    it(`Should pass test vector #${index + 1}`, async () => {
      const importedKey = await crypto.subtle.importKey(
        'raw',
        decodeUint8FromString(vector.key),
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      )
      const result = await decrypt(
        vector.ciphertext,
        importedKey
      )
      expect(result).toEqual(vector.plaintext)
    })
  })
})