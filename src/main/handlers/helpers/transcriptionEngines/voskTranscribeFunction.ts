import { JSONTranscription } from 'main/types';
import path from 'path';
import fs from 'fs';
import { TranscriptionConfigError } from '../../../utils/file/transcriptionConfig/helpers';
import { LocalTranscriptionAssetNotFoundError } from '../../../../vosk/helpers';
import getVoskTranscript from '../../../../vosk';
import { getAudioExtractPath } from '../../../util';
import { TranscriptionFunction } from '../transcribeTypes';
import getTranscriptionEngineConfig from '../../file/transcriptionConfig/getEngineConfig';
import { LocalConfig, TranscriptionEngine } from '../../../../sharedTypes';
import punctuate from '../../../editDelete/punctuate';

interface VoskWord {
  end: number;
  start: number;
  word: string;
}

const getModelPath = async () => {
  const localConfig = (await getTranscriptionEngineConfig(
    TranscriptionEngine.VOSK
  )) as LocalConfig;

  if (localConfig.modelPath === null)
    throw new TranscriptionConfigError('Vosk model path not configured');

  return path.resolve(localConfig.modelPath);
};

const transcribeWithVosk = async (audioFilePath: string) => {
  const modelPath = await getModelPath();

  if (!fs.existsSync(modelPath)) {
    throw new LocalTranscriptionAssetNotFoundError(
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

  const voskTranscript = JSON.parse(
    (await transcribeWithVosk(audioPath)) as string
  );

  const jsonTranscript = transcriptionAdaptor(
    voskTranscript.alternatives[0].result || []
  );

  const lastWord = jsonTranscript.words[jsonTranscript.words.length - 1];
  const totalDuration = lastWord.startTime + lastWord.duration;

  const mapCallback = punctuate(totalDuration, 0.3);

  const punctuatedTranscript = {
    ...jsonTranscript,
    words: jsonTranscript.words.map(mapCallback),
  };

  return punctuatedTranscript;
};

export default voskTranscribeFunction;
