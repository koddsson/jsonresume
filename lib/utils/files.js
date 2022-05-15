import AWS from 'aws-sdk'

AWS.config.update({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET
})

const endpoint = new AWS.Endpoint('ams3.digitaloceanspaces.com')
const s3 = new AWS.S3({endpoint})

export const putFile = (key, body, metadata, contentType, bucket = 'jsonresume') => {
  return new Promise((resolve, reject) => {
    s3.putObject(
      {
        Bucket: bucket,
        Key: key,
        Body: body,
        ACL: 'public-read',
        ContentType: contentType,
        Metadata: metadata
      },
      error => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      }
    )
  })
}

export const getMetadata = (key, bucket = 'jsonresume') => {
  return new Promise((resolve, reject) => {
    s3.headObject(
      {
        Bucket: bucket,
        Key: key
      },
      (error, results) => {
        if (error) {
          // TODO: Make sure this response is correct and not [Object object]
          // TODO: Make sure we can just expose this error
          if (error.code === 'NotFound') {
            resolve(null)
          } else {
            reject(error)
          }
        } else {
          resolve(results.Metadata)
        }
      }
    )
  })
}
