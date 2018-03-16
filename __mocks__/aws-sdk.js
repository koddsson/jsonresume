const AWS = jest.genMockFromModule('aws-sdk')

AWS.S3 = function() {
	return {
		putObject: (data, callback) => {
			callback(null)
		},
		headObject: (data, callback) => {
			if (data.Key === 'existing-user') {
				callback(null, {
					Metadata: { auth: new Buffer(data.Key).toString('base64') },
				})
			}
			callback({ code: 'NotFound' })
		},
		getObject: (data, callback) => {
			if (data.Key === 'not-a-user') {
				callback({ statusCode: 404 })
			}
			callback(null, { Body: '' })
		},
	}
}

module.exports = AWS
