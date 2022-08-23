import { StartTranscriptionJobCommand } from '@aws-sdk/client-transcribe';
import { transcribeClient } from './transcriptionClient';

// Set the parameters
export const params = {
  TranscriptionJobName: 'js_test3',
  LanguageCode: 'en-US', // For example, 'en-US'
  MediaFormat: 'mp3', // For example, 'wav'
  Media: {
    MediaFileUri:
      's3://fit3170/Y2Mate.is - Me at the zoo-jNQXAC9IVRw-96k-1659063146700.mp3',
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
