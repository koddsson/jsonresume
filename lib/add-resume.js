const fs = require('fs')
const AWS = require('aws-sdk')
const Ajv = require('ajv')
const mustache = require('mustache')
const { encrypt, decrypt } = require('./crypto')

// Set up JSON validator
const ajv = new Ajv()
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'))

// Set up document storage access so we can upload compiled resumes
AWS.config.update({
	accessKeyId: process.env.S3_KEY,
	secretAccessKey: process.env.S3_SECRET,
})
const endpoint = new AWS.Endpoint('ams3.digitaloceanspaces.com')
const s3 = new AWS.S3({ endpoint })

// Read the JSON schema and the mustache template on start since
// they are unlikely to change at runtime.
const schema = fs.readFileSync('./schema.json', 'utf8')
const template = fs.readFileSync('./themes/resume.template', 'utf8')

const getMetadata = username => {
	return new Promise((resolve, reject) => {
		s3.headObject(
			{
				Bucket: 'jsonresume',
				Key: username,
			},
			(error, results) => {
				if (error) {
					// TODO: Make sure this response is correct and not [Object object]
					// TODO: Make sure we can just expose this error
					if (error.code === 'NotFound') {
						resolve(null)
					} else {
						reject(error)
					}
				} else {
					resolve(results.Metadata)
				}
			},
		)
	})
}

module.exports = async (req, res) => {
	// Reject empty files
	if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
		return res
			.status(400)
			.json({ errors: ['You need to post data to this endpoint'] })
	}

	//  Reject requests without auth
	if (!req.headers.auth) {
		return res.status(400).json({
			errors: [
				'You need to supply a password via the `auth` header on first upload.',
			],
		})
	}

	const username = req.params.username
	const metadata = await getMetadata(username)

	if (metadata) {
		if (req.headers.auth !== decrypt(metadata.auth)) {
			return res.status(401).json({
				errors: [
					"The auth header does not match our records. Please make sure it's correct.",
				],
			})
		}
	}

	// Generate or update auth headers
	const auth = encrypt(req.headers.auth)

	// Validate the payload (event) against the JSON schema
	const valid = ajv.validate(JSON.parse(schema), req.body)

	if (!valid) {
		const errors = ajv.errors.map(error => {
			const dataPath = error.dataPath || 'The root JSON'
			return `${dataPath} ${error.message}: ${Object.values(error.params)}`
		})
		return res.status(400).json({ errors })
	}

	// Render the HTML resume with the data provided
	const html = mustache.render(template, req.body)

	// Deploy HTML file to object storage
	s3.putObject(
		{
			Bucket: 'jsonresume',
			Key: username,
			Body: html,
			ACL: 'public-read',
			ContentType: 'text/html',
			Metadata: { auth },
		},
		error => {
			if (error) {
				// TODO: Make sure this response is correct and not [Object object]
				// TODO: Make sure we can just expose this error
				return res.status(400).json({ errors: [error] })
			}

			// Success!
			const url = `https://jsonresume.ams3.digitaloceanspaces.com/${username}`
			return res
				.status(302)
				.set('Location', url)
				.json({ errors: [] })
		},
	)
}
