(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('cwi-array-encoding')) :
  typeof define === 'function' && define.amd ? define(['exports', 'cwi-array-encoding'], factory) :
  (global = global || self, factory(global.CWICrypto = {}, global.cwiArrayEncoding));
}(this, (function (exports, cwiArrayEncoding) { 'use strict';

  const encrypt = async (plaintext, key, returnType = 'string') => {
    if (typeof plaintext === 'undefined') {
      throw new Error('plaintext is a required parameter!');
    }

    if (typeof plaintext !== 'string' && plaintext.constructor !== Uint8Array) {
      throw new TypeError(`plaintext must be a string or Uint8Array, but ${typeof plaintext} was given!`);
    }

    if (typeof key === 'undefined') {
      throw new Error('key is a required parameter!');
    } // Plaintext is converted to a Uint8Array if it is not given as one


    const plaintextBuffer = typeof plaintext === 'string' ? new TextEncoder().encode(plaintext) : plaintext;
    const ivBuffer = crypto.getRandomValues(new Uint8Array(32));
    const ciphertext = new Uint8Array(await crypto.subtle.encrypt({
      name: 'AES-GCM',
      iv: ivBuffer
    }, key, plaintextBuffer));
    const ivWithCiphertext = new Uint8Array(ivBuffer.byteLength + ciphertext.byteLength);
    ivWithCiphertext.set(ivBuffer, 0);
    ivWithCiphertext.set(ciphertext, ivBuffer.byteLength);

    if (returnType === 'string') {
      return cwiArrayEncoding.encodeUint8AsString(ivWithCiphertext);
    } else if (returnType === 'Uint8Array') {
      return ivWithCiphertext;
    } else {
      throw new Error(`returnType must be either string or Uint8Array, but ${returnType} was given!`);
    }
  };

  /**
   * Decrypts the given ciphertext
   * @param {string} ciphertext ciphertext to decrypt
   * @param {CryptoKey} key key to use, defaults to the primary key
   * @param {string} returnType defaults to 'string', can also be 'Uint8Array'
   */

  const decrypt = async (ciphertext, key, returnType = 'string') => {
    if (typeof ciphertext === 'undefined') {
      throw new Error('ciphertext is a required parameter!');
    }

    if (typeof ciphertext !== 'string' && ciphertext.constructor !== Uint8Array) {
      throw new TypeError(`ciphertext must be either a string or a Uint8Array, but ${typeof ciphertext} was given!`);
    }

    if (typeof key === 'undefined') {
      throw new Error('key is a required parameter!');
    }

    let ciphertextWithIvBuffer;

    if (ciphertext.constructor === Uint8Array) {
      ciphertextWithIvBuffer = ciphertext;
    } else {
      ciphertextWithIvBuffer = cwiArrayEncoding.decodeUint8FromString(ciphertext);
    }

    const ivBuffer = ciphertextWithIvBuffer.slice(0, 32);
    const ciphertextBuffer = ciphertextWithIvBuffer.slice(32);

    try {
      const plaintext = await crypto.subtle.decrypt({
        name: 'AES-GCM',
        iv: ivBuffer
      }, key, ciphertextBuffer);

      if (returnType === 'string') {
        return new TextDecoder().decode(new Uint8Array(plaintext));
      } else if (returnType === 'Uint8Array') {
        return new Uint8Array(plaintext);
      } else {
        throw new Error(`returnType must be either string or Uint8Array, but ${returnType} was given!`);
      }
    } catch (e) {
      throw new Error('Decryption failed!');
    }
  };

  /**
   * Generates a secure AES-GCM 256 bit key for crypographic operations
   * @returns the generated key in the form of a buffer
   */
  const generate = async () => {
    return await crypto.subtle.generateKey({
      name: 'AES-GCM',
      length: 256
    }, true, ['encrypt', 'decrypt']).then(async key => {
      const keyBuffer = await crypto.subtle.exportKey('raw', key);
      return keyBuffer;
    });
  };

  var XOR = ((k1, k2) => {
    if (k1.constructor !== Uint8Array || k2.constructor !== Uint8Array) {
      throw new TypeError('k1 and k2 must be Uint8Arrays!');
    }

    if (k1.length !== k2.length) {
      throw new Error('k1 and k2 need to be the same length!');
    }

    const r = new Uint8Array(k1.length);

    for (let i = 0; i < k1.length; i++) {
      r[i] = k1[i] ^ k2[i];
    }

    return r;
  });

  var keyFromString = (async ({
    string,
    salt
  }) => {
    const importedKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(string), {
      name: 'PBKDF2'
    }, false, ['deriveKey']);
    return crypto.subtle.deriveKey({
      name: 'PBKDF2',
      salt,
      iterations: 103300,
      hash: {
        name: 'SHA-256'
      }
    }, importedKey, {
      name: 'AES-GCM',
      length: 256
    }, true, ['encrypt', 'decrypt']);
  });

  exports.XOR = XOR;
  exports.decrypt = decrypt;
  exports.encrypt = encrypt;
  exports.generate = generate;
  exports.keyFromString = keyFromString;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
