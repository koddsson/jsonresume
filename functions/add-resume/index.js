const fs = require('fs');
const AWS = require('aws-sdk');
const Ajv = require('ajv');
const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

AWS.config.update({region: 'eu-west-1'});
const docClient = new AWS.DynamoDB.DocumentClient();

// TODO: Convert to promises?
exports.handle = (event, context, callback) => {
  fs.readFile('./schema.json', (err, schema) => {
    if (err) {
      callback(err);
    }

    // Validate the payload (event) against the JSON schema
    const valid = ajv.validate(schema, event);

    if (!valid) {
      callback(ajv.errorsText());
    } else {
      // Add it into dynamodb
      // (echo it back for now)
      callback(null, event);
    }
  });
}
