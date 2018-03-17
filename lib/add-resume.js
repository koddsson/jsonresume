const fs = require('fs')
const Ajv = require('ajv')
const mustache = require('mustache')
const { encrypt, decrypt } = require('./utils/crypto')
const { putFile, getMetadata } = require('./utils/files')

// Set up JSON validator
const ajv = new Ajv()
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'))

// Read the JSON schema and the mustache template on start since
// they are unlikely to change at runtime.
const schema = fs.readFileSync('./schema.json', 'utf8')
const template = fs.readFileSync('./themes/resume.template', 'utf8')

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

	Promise.all([
		putFile(`${username}.html`, html, { auth }, 'text/html'),
		putFile(
			`${username}.json`,
			JSON.stringify(req.body),
			{ auth },
			'application/json',
		),
	])
		.then(() => {
			// Success!
			const url = `https://jsonresume.io/${username}`
			return res
				.status(302)
				.set('Location', url)
				.json({ errors: [] })
		})
		.catch(error => {
			// TODO: Make sure this response is correct and not [Object object]
			// TODO: Make sure we can just expose this error
			return res.status(400).json({ errors: [error] })
		})
}
