const AWS = require('aws-sdk')

AWS.config.update({
	accessKeyId: process.env.S3_KEY,
	secretAccessKey: process.env.S3_SECRET,
})
const endpoint = new AWS.Endpoint('ams3.digitaloceanspaces.com')
const s3 = new AWS.S3({ endpoint })

module.exports = (req, res) => {
	const username = req.params.username
	s3.getObject(
		{
			Bucket: 'jsonresume',
			Key: username,
		},
		function(error, data) {
			if (error) {
				// TODO: Make sure this response is correct and not [Object object]
				// TODO: Make sure we can just expose this error
				return res.status(400).json({ errors: [error] })
			}
			return res.send(data.Body.toString('utf-8'))
		},
	)
}
