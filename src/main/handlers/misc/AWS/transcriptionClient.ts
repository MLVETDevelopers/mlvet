import * as credentials from './config.json';

const { TranscribeClient } = require('@aws-sdk/client-transcribe');
// Set the AWS Region.

// Create an Amazon Transcribe service client object.
const transcribeClient = new TranscribeClient({
  region: credentials.region,
  credentials: {
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
  },
});

// eslint-disable-next-line import/prefer-default-export
export { transcribeClient };
