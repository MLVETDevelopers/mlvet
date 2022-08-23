const AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

const s3 = new AWS.S3();

async function getObject(bucket: string, objectKey: string) {
  try {
    const params = {
      Bucket: bucket,
      Key: objectKey,
    };

    const data = await s3.getObject(params).promise();

    return data.Body.toString('utf-8');
  } catch (e) {
    throw new Error(`Could not retrieve file from S3: ${e.message}`);
  }
}

export default getObject;
