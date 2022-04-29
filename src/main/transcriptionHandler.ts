/**
 * util to simulate running of transcription
 * @param n seconds to sleep
 * @returns promise resolving after n seconds
 */
import path from 'path';
import { app } from 'electron';
import Transcription from 'sharedTypes/Transcription';

const fs = require('fs');

const handleTranscription: (
  fileName: string
) => Promise<Transcription> = async () => {
  // Read from sample transcript. Replace this section with real transcript input
  const transcriptionPath = app.isPackaged
    ? path.join(process.resourcesPath, 'assets/SampleTranscript.json')
    : path.join(__dirname, '../../assets/SampleTranscript.json');

  const rawtranscription = fs.readFileSync(transcriptionPath);
  const jsontranscript = JSON.parse(rawtranscription);
  console.assert(jsontranscript.transcripts.length === 1); // TODO: add more error handling here
  const newtranscript: Transcription = jsontranscript.transcripts[0];
  return newtranscript;
};

export default handleTranscription;
