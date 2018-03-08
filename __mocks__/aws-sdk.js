const AWS = jest.genMockFromModule('aws-sdk')

AWS.S3 = function() {
  return {
    putObject: () => {}
  }
}

module.exports = AWS
