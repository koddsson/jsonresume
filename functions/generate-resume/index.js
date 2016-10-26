const fs = require('fs');
const AWS = require('aws-sdk');
const mustache = require('mustache');

AWS.config.update({region: 'eu-west-1'});
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handle = (event, context, callback) => {
  fs.readFile('./themes/resume.template', (err, data) => {
    const query = {TableName: 'json-resume', Key: event.params};
    docClient.get(query, (dynamoError, dynamoData) => {
      if (dynamoError) {
        context.fail('500');
      } else if (!Object.keys(dynamoData).length) {
        context.fail('404');
      } else {
        const renderedData = mustache.render(data.toString(), dynamoData.Item);
        context.succeed(renderedData);
      }
    });
  });
}
