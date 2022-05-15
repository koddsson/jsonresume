import crypto from 'crypto'

const privateKey = process.env.PRIVATE_KEY

export function encrypt (toEncrypt) {
  const buffer = Buffer.from(toEncrypt)
  const encrypted = crypto.publicEncrypt(privateKey, buffer)
  return encrypted.toString('base64')
}

export function decrypt (toDecrypt) {
  const buffer = Buffer.from(toDecrypt, 'base64')
  const decrypted = crypto.privateDecrypt(privateKey, buffer)
  return decrypted.toString('utf8')
}

export default {
  encrypt, decrypt
}
