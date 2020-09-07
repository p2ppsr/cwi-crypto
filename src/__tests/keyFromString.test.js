import keyFromString from '../keyFromString'
import { ValidationError } from '@cwi/errors'
import { looksLikeCryptoKeyObject } from '@cwi/validation'
// import vectors from './keyFromString.vectors'

describe('keyFromString', () => {
  it('Should return a CryptoKey object', async () => {
    const returnValue = await keyFromString({
      string: 'stringity-string-string',
      salt: new Uint8Array([
        'S'.charCodeAt(0),
        'e'.charCodeAt(0),
        'a'.charCodeAt(0),
        's'.charCodeAt(0),
        'o'.charCodeAt(0),
        'n'.charCodeAt(0),
        'i'.charCodeAt(0),
        'n'.charCodeAt(0),
        'g'.charCodeAt(0)
      ])
    })
    expect(looksLikeCryptoKeyObject(returnValue)).toBe(true)
  })
  it('Should throw a ValidationError without a salt', async () => {

  })
  it('Should throw a TypeError if the string is not a string', async () => {

  })
  it('Should throw a TypeError if the salt is not a Uint8Array', async () => {

  })
})