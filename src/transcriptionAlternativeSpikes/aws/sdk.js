import { S3Client } from '@aws-sdk/client-s3';
// eslint-disable-next-line import/no-unresolved
import { StartTranscriptionJobCommand } from '@aws-sdk/client-transcribe';
// eslint-disable-next-line import/no-unresolved, import/extensions
import { transcribeClient } from './libs/transcribeClient.js';

// Set the AWS Region.
const REGION = 'us-west-1'; // e.g. "us-east-1"
// Create an Amazon S3 service client object.
const s3Client = new S3Client({ region: REGION });

// Set the parameters
export const params = {
  TranscriptionJobName: 'js_test',
  LanguageCode: 'en_US', // For example, 'en-US'
  MediaFormat: 'mp3', // For example, 'wav'
  Media: {
    _MediaFileUri:
      's3://fit3170/Y2Mate.is - Me at the zoo-jNQXAC9IVRw-96k-1659063146700.mp3',
    get MediaFileUri() {
      // eslint-disable-next-line no-underscore-dangle
      return this._MediaFileUri;
    },
    set MediaFileUri(value) {
      // eslint-disable-next-line no-underscore-dangle
      this._MediaFileUri = value;
    },
    // For example, "https://transcribe-demo.s3-REGION.amazonaws.com/hello_world.wav"
  },
  OutputBucketName: 'fit3170',
};

// eslint-disable-next-line consistent-return
export const run = async () => {
  try {
    const data = await transcribeClient.send(
      new StartTranscriptionJobCommand(params)
    );
    console.log('Success - put', data);
    return data; // For unit tests.
  } catch (err) {
    console.log('Error', err);
  }
};
run();
