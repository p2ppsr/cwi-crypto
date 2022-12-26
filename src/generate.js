/**
 * Generates a secure AES-GCM 256 bit key for crypographic operations
 * @returns the generated key in the form of a buffer
 */
const generate = async () => {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  ).then(async key => {
    const keyBuffer = await crypto.subtle.exportKey('raw', key)
    return keyBuffer
  })
}
export default generate
