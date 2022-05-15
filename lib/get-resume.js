const AWS = require('aws-sdk')

AWS.config.update({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET
})
const endpoint = new AWS.Endpoint('ams3.digitaloceanspaces.com')
const s3 = new AWS.S3({endpoint})

module.exports = (req, res) => {
  const [username, type = 'html'] = req.params.username.split('.')
  s3.getObject(
    {
      Bucket: 'jsonresume',
      Key: `${username}.${type}`
    },
    function (error, data) {
      if (error) {
        const statusCode = error.statusCode || 500
        let errorMessage = 'Something went wrong'
        if (statusCode === 404) {
          errorMessage = `No resume found for ${username}`
        }
        return res.status(statusCode).json({errors: [errorMessage]})
      }
      return res.send(data.Body.toString('utf-8'))
    }
  )
}
