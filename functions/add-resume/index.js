const AWS = require('aws-sdk');

AWS.config.update({region: 'eu-west-1'});
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handle = (event, context, callback) => {
  // Take the payload and put it into DynamoDB?
  console.log(event);
  console.log(context);
  callback(
    null,
    {event, context}
  );
}
