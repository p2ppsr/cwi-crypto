/**
 * These are test vectors for the XOR function.
 * A and B are the inputs and R is the expected result.
 * All values are conventional arrays between 0 and 255.
 * They will be converted into Uint8Arrays by the test runner.
 * 
 * To better represent certain binary values, parseInt() is used to define some 
 * of the array elements with a base-2 radix. These values are always padded to 
 * 8 bits, for example parseInt('00000111', 2) yields the integer 7 for that 
 * array element's value.
 */
export default [
  {
    a: [0],
    b: [0],
    r: [0]
  },
  {
    a: [0],
    b: [1],
    r: [1]
  },
  {
    a: [1],
    b: [0],
    r: [1]
  },
  {
    a: [1],
    b: [1],
    r: [0]
  },
  {
    a: [parseInt('00000111', 2)],
    b: [parseInt('00000101', 2)],
    r: [parseInt('00000010', 2)]
  },
  {
    a: [parseInt('00000000', 2)],
    b: [parseInt('11111111', 2)],
    r: [parseInt('11111111', 2)]
  },
  {
    a: [parseInt('10000001', 2)],
    b: [parseInt('01111110', 2)],
    r: [parseInt('11111111', 2)]
  },
  {
    a: [parseInt('00000000', 2), parseInt('01010101', 2)],
    b: [parseInt('00001111', 2), parseInt('10101011', 2)],
    r: [parseInt('00001111', 2), parseInt('11111110', 2)]
  },
  {
    a: [254],
    b: [186],
    r: [68]
  }
]