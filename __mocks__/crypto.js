const crypto = jest.requireActual('crypto')

crypto.publicEncrypt = (publicKey, buffer) => buffer
crypto.privateDecrypt = (publicKey, buffer) => buffer

export default crypto
