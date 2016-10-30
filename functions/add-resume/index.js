const fs = require('fs');
const AWS = require('aws-sdk');
const Ajv = require('ajv');
const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

AWS.config.update({region: 'eu-west-1'});
const docClient = new AWS.DynamoDB.DocumentClient();

// TODO: Convert to promises?
exports.handle = (event, context, callback) => {
  console.log(event);
  const username = event.username;
  del event.username;
  fs.readFile('./schema.json', 'utf-8', (err, schema) => {
    if (err) {
      callback(err);
    }

    // Validate the payload (event) against the JSON schema
    const valid = ajv.validate(JSON.parse(schema), event);

    if (!valid) {
      callback(JSON.stringify(ajv.errors));
    } else {
      // Add it into dynamodb
      // (echo it back for now)
      event.username = username;
      callback(null, event);
    }
  });
}
