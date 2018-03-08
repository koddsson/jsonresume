const AWS = jest.genMockFromModule('aws-sdk')

AWS.S3 = function() {
  return {
    putObject: (data, callback) => {
      callback(null, true)
    }
  }
}

module.exports = AWS
