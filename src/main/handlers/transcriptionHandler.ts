import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import getAudioDurationInSeconds from 'get-audio-duration';
import { Transcription } from '../../sharedTypes';
import preProcessTranscript from '../editDelete/preProcess';

/**
 * util to simulate running of transcription
 * @param n seconds to sleep
 * @returns promise resolving after n seconds
 */
const sleep: (n: number) => Promise<void> = (n) =>
  new Promise((resolve) => setTimeout(resolve, n * 1000));

const handleTranscription: (
  fileName: string
) => Promise<Transcription> = async () => {
  // TODO: replace hard coded media path with parameter passed in
  const pathToSaveMedia = path.join(
    process.cwd(),
    'assets',
    'audio',
    'audio.wav'
  );
  const audioDurationPromise = getAudioDurationInSeconds(pathToSaveMedia)
    .then((duration) => {
      return duration;
    })
    .catch((error) => {});

  await sleep(3); // Sleep to simulate transcription time. Remove this when real transcription is added

  // Read from sample transcript. Replace this section with real transcript input
  const transcriptionPath = app.isPackaged
    ? path.join(process.resourcesPath, 'assets/SampleTranscript.json')
    : path.join(__dirname, '../../../assets/SampleTranscript.json');

  const rawTranscription = fs.readFileSync(transcriptionPath).toString();
  const jsonTranscript = JSON.parse(rawTranscription);

  console.assert(jsonTranscript.transcripts.length === 1); // TODO: add more error handling here
  const duration: number = (await audioDurationPromise) || 0;
  const processedTranscript = preProcessTranscript(
    jsonTranscript.transcripts[0],
    duration
  );

  return processedTranscript;
};

export default handleTranscription;
