const {encrypt, decrypt} = require.requireActual('../../lib/crypto')

describe('encrypt', () => {
  test('same string is encrypted in the same way', async () => {
    encrypt('hello') === encrypt('hello')
  });
  test('different string is not encrypted in the same way', async () => {
    encrypt('hello') === encrypt('world')
  });
  test('strings can be decrypted', async () => {
    'hello' === decrypt(encrypt('hello'))
    'hello' !== decrypt(encrypt('world'))
  });
})
