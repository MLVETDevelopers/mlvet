import path from 'path';
import fs from 'fs';
import getVoskTranscript from './getVoskTranscript';

const transcribeWithVosk = async (audioFilePath: string) => {
  const modelName = 'vosk-model-en-us-0.22';
  const modelPath = path.join(
    __dirname,
    '../../../.',
    `assets/voskModel/${modelName}`
  );

  if (!fs.existsSync(modelPath)) {
    throw new Error(
      `Model ${modelPath} not found. Have you downloaded the model and put it in the assets folder?`
    );
  }
  const result = (await getVoskTranscript(modelPath, audioFilePath)) as string;

  return result;
};

export default transcribeWithVosk;
