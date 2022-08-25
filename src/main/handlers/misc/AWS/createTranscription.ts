import { StartTranscriptionJobCommand } from '@aws-sdk/client-transcribe';
import { transcribeClient } from './transcriptionClient';

// eslint-disable-next-line consistent-return
const createTranscription = async (bucket: string, name: string) => {
  // Set the parameters
  const params = {
    TranscriptionJobName: name,
    LanguageCode: 'en-US', // For example, 'en-US'
    MediaFormat: 'wav', // For example, 'wav'
    Media: {
      MediaFileUri: 's3://fit3170/extractedAudio.wav',
    },
    OutputBucketName: bucket,
  };
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

export default createTranscription;
