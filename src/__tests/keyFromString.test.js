import keyFromString from '../keyFromString'

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
    expect(returnValue).toEqual(expect.objectContaining({
      type: 'secret'
    }))
  })
  it('Should throw a Error without a salt', async () => {

  })
  it('Should throw a TypeError if the string is not a string', async () => {

  })
  it('Should throw a TypeError if the salt is not a Uint8Array', async () => {

  })
})