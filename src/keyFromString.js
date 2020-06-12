export default async ({ string, salt }) => {
  const importedKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(string),
    {
      name: 'PBKDF2'
    },
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 103300,
      hash: {
        name: 'SHA-256'
      }
    },
    importedKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )
}
