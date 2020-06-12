import XOR from '../XOR'
import { ValidationError } from '@p2ppsr/standard-errors'
import vectors from './XOR.vectors'

describe('XOR', () => {
  it('Should throw a TypeError if called without arguments', () => {
    expect(() => XOR()).toThrow(TypeError)
  })
  it('Should throw a TypeError if either input is not a Uint8Array', () => {
    let array_1 = [913, 521, -327]
    let uint8_1 = new Uint8Array([22, 33, 44])
    let array_2 = [1024, 512, 3072]
    let uint8_2 = new Uint8Array([11, 23, 58])
    expect(() => XOR(array_1, array_2)).toThrow(TypeError)
    expect(() => XOR(array_1, uint8_1)).toThrow(TypeError)
    expect(() => XOR(uint8_2, array_2)).toThrow(TypeError)
    expect(() => XOR(uint8_1, uint8_2)).not.toThrow(TypeError)
  })
  it(
    'Should throw a ValidationError if both inputs are not the same length',
    () => {
      let a = new Uint8Array([1, 2, 3])
      let b = new Uint8Array([4, 5])
      expect(() => XOR(a, b)).toThrow(ValidationError)
    }
  )
  it('Should return a value of type Uint8Array', () => {
    const returnValue = XOR(
      new Uint8Array([1, 2, 3]),
      new Uint8Array([3, 2, 1])
    )
    expect(returnValue.constructor).toEqual(Uint8Array)
  })
  it('Should return a value the same byteLength as both inputs', () => {
    const inputA = new Uint8Array([11, 23, 58, 13, 21])
    const inputB = new Uint8Array([34, 55, 89, 144, 233])
    const result = XOR(inputA, inputB)
    expect(result.byteLength).toEqual(inputA.byteLength)
    expect(result.byteLength).toEqual(inputB.byteLength)
  })
  it('XORs a random array with itself to arrive at all zeroes', () => {
    const randomArray = crypto.getRandomValues(new Uint8Array(128))
    const result = XOR(randomArray, randomArray)
    for (let i = 0; i < result.byteLength; i++) {
      expect(result[i]).toEqual(0)
    }
  })

  vectors.forEach((v, i) => {
    it(`Should pass test vector ${i}`, () => {
      const result = XOR(
        new Uint8Array(v.a),
        new Uint8Array(v.b)
      )
      expect(result).toEqual(new Uint8Array(v.r))
    })
  })
})