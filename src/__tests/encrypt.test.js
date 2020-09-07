import encrypt from '../encrypt'
import decrypt from '../decrypt'
import { decodeUint8FromString } from '@cwi/array-encoding'
import { ValidationError } from '@cwi/errors'

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

describe('encrypt', () => {
  it('Throws a ValidationError if plaintext is not provided', async () => {
    expect(encrypt(
      undefined,
      await getKey(1)
    )).rejects.toThrow(new ValidationError(
      'plaintext is a required parameter!'
    ))
  })
  it('Throws a TypeError if plaintext is not a string or Uint8Array', async () => {
    expect(encrypt(
      ['ar', 'ray'],
      await getKey(1)
    )).rejects.toThrow(TypeError)
    expect(encrypt(
      {ob: 'ject'},
      await getKey(1)
    )).rejects.toThrow(TypeError)
  })
  it('Throws a ValidationError if key is not a CryptoKey object', async () => {
    expect(encrypt(
      'string',
      { non: 'crypto', key: 'object' }
    )).rejects.toThrow(new ValidationError(
      'Invalid key: cryptoKey must contain a kty parameter!'
    ))
  })
  it('Throws a ValidationError if no key is given', async () => {
    expect(encrypt(
      'string',
      undefined
    )).rejects.toThrow(new ValidationError(
      'key is a required parameter!'
    ))
  })
  it('Returns a string value of sane length for input', async () => {
    const result1 = await encrypt('one two three four five', await getKey(3))
    expect(typeof result1).toBe('string')
    expect(result1.length).toBeGreaterThanOrEqual(30)
    expect(result1.length).toBeLessThanOrEqual(150)

    const result2 = await encrypt(
      encodeUint8AsString(crypto.getRandomValues(new Uint8Array(500))),
      await getKey(3)
    )
    expect(typeof result2).toBe('string')
    expect(result2.length).toBeGreaterThanOrEqual(600)
    expect(result2.length).toBeLessThanOrEqual(1200)
  })
  it('Produces output that can be decrypted', async () => {
    const originalValue = 'a thing to encrypt'
    const encryptedValue = await encrypt(
      originalValue,
      await getKey(2)
    )
    const decryptedValue = await decrypt(
      encryptedValue,
      await getKey(2)
    )
    expect(originalValue).toEqual(decryptedValue)
  })
  it('Encrypts values of type Uint8Array', async () => {
    const originalValue = new Uint8Array([42, 99, 33, 0, 1])
    const encryptedValue = await encrypt(
      originalValue,
      await getKey(2)
    )
    const decryptedValue = await decrypt(
      encryptedValue,
      await getKey(2),
      'Uint8Array'
    )
    expect(originalValue).toEqual(decryptedValue)
  })
  it('Can return the result as a Uint8Array', async () => {
    const originalValue = new Uint8Array([5, 95, 6, 94])
    const encryptedValue = await encrypt(
      originalValue,
      await getKey(2),
      'Uint8Array'
    )
    expect(encryptedValue.constructor).toEqual(Uint8Array)
  })
})