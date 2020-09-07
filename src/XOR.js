import { ValidationError } from '@cwi/errors'

export default (k1, k2) => {
  if (
    (k1.constructor !== Uint8Array) ||
    (k2.constructor !== Uint8Array)
  ) {
    throw new TypeError('k1 and k2 must be Uint8Arrays!')
  }
  if (k1.length !== k2.length) {
    throw new ValidationError('k1 and k2 need to be the same length!')
  }
  const r = new Uint8Array(k1.length)
  for (let i = 0; i < k1.length; i++) {
    r[i] = k1[i] ^ k2[i]
  }
  return r
}
