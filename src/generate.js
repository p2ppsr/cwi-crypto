/**
 * Generates a secure AES-GCM 256 bit key for crypographic operations
 * @param format the format the key should be returned as (defaults to buffer). Supports base64, hex, and buffer data types.
 * @returns the generated key
 */
const generate = async (format = 'buffer') => {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  ).then(async key => {
    const keyBuffer = await crypto.subtle.exportKey('raw', key)
    if (format === 'buffer') {
      return keyBuffer
    } else if (format === 'base64') {
      return Buffer.from(keyBuffer).toString('base64')
    } else if (format === 'hex') {
      return Buffer.from(keyBuffer).toString('hex')
    } else {
      throw TypeError('Specified format is not supported!')
    }
  })
}
export default generate
