import { JSONTranscription } from 'main/types';
import path from 'path';
import fs from 'fs';
import { exec, ExecException } from 'child_process';
import { app } from 'electron';
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

interface AsyncCmdOutput {
  res: string;
  success: boolean;
  error: Error | null;
}

const getAsyncVoskScriptPath = () => {
  return app.isPackaged
    ? path.join(__dirname, 'asyncVosk.ts')
    : path.join(__dirname, '../../../../vosk/asyncVosk.ts');
};

const asyncTranscribeWithVosk = async (
  dllLibsPath: string,
  modelPath: string,
  audioFilePath: string
) => {
  const controller = new AbortController();

  const result = await new Promise((resolve, reject) => {
    const scriptPath = getAsyncVoskScriptPath();
    const cmd = `ts-node ${scriptPath} ${dllLibsPath} ${modelPath} ${audioFilePath}`;

    const child = exec(
      cmd,
      { signal: controller.signal },
      (error: ExecException | null, stdout: string, stderr: string) => {
        if (error) {
          reject(error);
        }
        if (stdout) {
          const out: AsyncCmdOutput = JSON.parse(stdout);
          if (out.success) {
            resolve(out.res);
          }
          reject(out.error);
        }
        if (stderr) console.error(stderr);
      }
    );

    child.on('exit', (code: number) => {
      console.log(
        'Vosk Transcription child process exited with exit code',
        code
      );
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
