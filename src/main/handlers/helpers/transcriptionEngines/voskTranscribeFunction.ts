import { JSONTranscription } from 'main/types';
import path from 'path';
import fs from 'fs';
import getVoskTranscript from '../../../../vosk';
import { getAudioExtractPath } from '../../../util';
import { TranscriptionFunction } from '../transcribeTypes';

interface VoskWord {
  end: number;
  start: number;
  word: string;
}

const transcribeWithVosk = async (audioFilePath: string) => {
  const modelName = 'vosk-model-en-us-0.22';
  const modelPath = path.join(
    __dirname,
    '../../../../../assets/voskModel',
    modelName
  );

  if (!fs.existsSync(modelPath)) {
    throw new Error(
      `Model ${modelPath} not found. Have you downloaded the model and put it in the assets folder?`
    );
  }
  const result = (await getVoskTranscript(modelPath, audioFilePath)) as string;

  return result;
};

const transcriptionAdaptor: (wordList: VoskWord[]) => JSONTranscription = (
  wordList
) => ({
  words: wordList.map((result) => ({
    word: result.word,
    startTime: result.start,
    duration: result.end - result.start,
    confidence: 1,
  })),
});

const voskTranscribeFunction: TranscriptionFunction = async (project) => {
  const audioPath = getAudioExtractPath(project.id);

  console.log('Transcribing with vosk...');

  const jsonTranscript = JSON.parse(
    (await transcribeWithVosk(audioPath)) as string
  );

  return transcriptionAdaptor(jsonTranscript.alternatives[0].result || []);
};

export default voskTranscribeFunction;
