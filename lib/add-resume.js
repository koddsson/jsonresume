const fs = require("fs");
const AWS = require("aws-sdk");
const Ajv = require("ajv");
const mustache = require('mustache')

// Set up JSON validator
const ajv = new Ajv();
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

// Set up document storage access so we can upload compiled resumes
AWS.config.update({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET
});
const endpoint = new AWS.Endpoint('ams3.digitaloceanspaces.com')
const s3 = new AWS.S3({endpoint});

// Read the JSON schema and the mustache template on start since
// they are unlikely to change at runtime.
const schema = fs.readFileSync('./schema.json', 'utf8')
const template = fs.readFileSync('./themes/resume.template', 'utf8')

module.exports = async (req, res) => {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    return res.status(400).json({errors: ['You need to post data to this endpoint']})
  }

  // Validate the payload (event) against the JSON schema
  const valid = ajv.validate(JSON.parse(schema), req.body);
  
  if (!valid) {
    const errors = ajv.errors.map(error => {
      const dataPath = error.dataPath || 'The root JSON'
      return `${dataPath} ${error.message}: ${Object.values(error.params)}` 
    })
    return res.status(400).json({errors})
  }
  
  // Render the HTML resume with the data provided
  const html = mustache.render(template, req.body)

  try {
    // Deploy HTML file to object storage
    await s3.putObject({
      Bucket: 'jsonresume',
      Key: req.params.username,
      Body: html,
      ACL: 'public-read',
      ContentType: "text/html",
    })
  } catch (error) {
    // TODO: Make sure this response is correct and not [Object object]
    // TODO: Make sure we can just expose this error
    return res.status(400).json({errors: [error]})
  }

  // Success!
  // TODO: Return a 302 with Location header set to the newly created HTML document
  // Can we return a 302 with a body?
  return res.json({errors: []})
};
