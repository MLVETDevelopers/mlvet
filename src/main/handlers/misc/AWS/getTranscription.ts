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
    if (typeof e === 'string') {
      throw new Error(`Could not retrieve file from S3: ${e.toUpperCase}`);
    } else if (e instanceof Error) {
      throw new Error(`Could not retrieve file from S3: ${e.message}`);
    } else {
      return null;
    }
  }
}

export default getObject;
