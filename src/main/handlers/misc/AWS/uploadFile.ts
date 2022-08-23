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

const file = './Me at the zoo.mp3'; // Path to and name of object. For example '../myFiles/index.js'.
const fileStream = fs.createReadStream(file);

// Set the parameters
export const uploadParams = {
  Bucket: 'fit3170',
  // Add the required 'Key' parameter using the 'path' module.
  Key: path.basename(file),
  // Add the required 'Body' parameter
  Body: fileStream,
};

// Upload file to specified bucket.
// eslint-disable-next-line consistent-return
export const run = async () => {
  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log('Success', data);
    return data; // For unit tests.
  } catch (err) {
    console.log('Error', err);
  }
};
run();
