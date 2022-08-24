// Import required AWS SDK clients and commands for Node.js.
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import path from 'path';
import fs from 'fs';
import * as credentials from './config.json';

const s3Client = new S3Client({
  region: credentials.region,
  credentials: {
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
  },
});

// Upload file to specified bucket.
// eslint-disable-next-line consistent-return
const run = async (file: string) => {
  const fileStream = fs.createReadStream(file);
  // Set the parameters
  const uploadParams = {
    Bucket: 'fit3170',
    // Add the required 'Key' parameter using the 'path' module.
    Key: path.basename(file),
    // Add the required 'Body' parameter
    Body: fileStream,
  };
  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    return data; // For unit tests.
  } catch (err) {
    if (typeof err === 'string') {
      throw new Error(`Could not upload file to S3: ${err.toUpperCase}`);
    } else if (err instanceof Error) {
      throw new Error(`Could not upload file to S3: ${err.message}`);
    } else {
      return null;
    }
  }
};

export default run;
