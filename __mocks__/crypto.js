const crypto = require.requireActual('crypto')

crypto.publicEncrypt = (publicKey, buffer) => buffer
crypto.privateDecrypt = (publicKey, buffer) => buffer

module.exports = crypto
