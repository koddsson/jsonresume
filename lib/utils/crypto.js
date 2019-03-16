const crypto = require('crypto')
const privateKey = process.env.PRIVATE_KEY

function encryptStringWithRsaPublicKey(toEncrypt) {
  const buffer = Buffer.from(toEncrypt)
  const encrypted = crypto.publicEncrypt(privateKey, buffer)
  return encrypted.toString('base64')
}

function decryptStringWithRsaPrivateKey(toDecrypt) {
  const buffer = Buffer.from(toDecrypt, 'base64')
  const decrypted = crypto.privateDecrypt(privateKey, buffer)
  return decrypted.toString('utf8')
}

module.exports = {
  encrypt: encryptStringWithRsaPublicKey,
  decrypt: decryptStringWithRsaPrivateKey
}
