const fs = require("fs");
const AWS = require("aws-sdk");
const Ajv = require("ajv");
const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

AWS.config.update({ accessKeyId: 'AYEPWQJG4TCA2IDMVSIP', secretAccessKey: 'pLPfEciQ4vJL6XrxVnEPmGMi8sjEBHoNmSpxe/giVfY' });
const ep = new AWS.Endpoint('ams3.digitaloceanspaces.com')
const s3 = new AWS.S3({endpoint: ep});
  
const schema = fs.readFileSync("./schema.json", "utf-8")

// TODO: Convert to promises?
module.exports = (req, res) => {
  console.log(req.body)

  // Validate the payload (event) against the JSON schema
  const valid = ajv.validate(JSON.parse(schema), req.body);

  // TODO: Move merging of JSON with mustache here from generate resume file

  if (!valid) {
    res.json({errors: ajv.errors})
  } else {
    s3.putObject({
      Bucket: 'jsonresume',
      Key: req.params.username,
      Body: Buffer.from(JSON.stringify(req.body), 'binary'),
      ACL: 'public-read'
    },function (resp) {
      res.json({errors: []})
      console.log(arguments);
      console.log('Successfully uploaded package.');
    });
  }
};
