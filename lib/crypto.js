var crypto = require('crypto')
var privateKey = process.env.PRIVATE_KEY

var encryptStringWithRsaPublicKey = function(toEncrypt) {
	var buffer = new Buffer(toEncrypt)
	var encrypted = crypto.publicEncrypt(privateKey, buffer)
	return encrypted.toString('base64')
}

var decryptStringWithRsaPrivateKey = function(toDecrypt) {
	var buffer = new Buffer(toDecrypt, 'base64')
	var decrypted = crypto.privateDecrypt(privateKey, buffer)
	return decrypted.toString('utf8')
}

module.exports = {
	encrypt: encryptStringWithRsaPublicKey,
	decrypt: decryptStringWithRsaPrivateKey
}
