import { JSONTranscription } from 'main/types';
import path from 'path';
import fs from 'fs';
import { fork } from 'child_process';
import { getDllDir } from '../../../../vosk/util';
import { TranscriptionConfigError } from '../../../utils/file/transcriptionConfig/helpers';
import { LocalTranscriptionAssetNotFoundError } from '../../../../vosk/helpers';
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

const asyncTranscribeWithVosk = async (
  dllLibsPath: string,
  modelPath: string,
  audioFilePath: string
) => {
  const controller = new AbortController();

  const result = await new Promise((resolve, reject) => {
    const child = fork(
      path.resolve(__dirname, '../../../../vosk/asyncVosk.ts'),
      [dllLibsPath, modelPath, audioFilePath],
      { signal: controller.signal }
    );

    if (!child) throw new Error('child process not created');

    child.on('message', (res) => {
      resolve(res);
    });

    child.on('error', (err) => {
      reject(err);
    });
  });

  return result as string;
};

const transcribeWithVosk = async (audioFilePath: string) => {
  const dllLibsDirPath = await getDllDir();
  const modelPath = await getModelPath();

  if (!fs.existsSync(modelPath)) {
    throw new LocalTranscriptionAssetNotFoundError(
      `Model ${modelPath} not found. Have you downloaded the model and put it in the assets folder?`
    );
  }

  const result = (await asyncTranscribeWithVosk(
    dllLibsDirPath,
    modelPath,
    audioFilePath
  )) as string;

  console.log(result);

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
