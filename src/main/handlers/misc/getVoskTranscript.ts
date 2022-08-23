import { Readable } from 'stream';
import fs from 'fs';

const vosk = require('vosk');
const wav = require('wav');

const getVoskTranscript = (modelPath: string, filePath: string) => {
  vosk.setLogLevel(-1);
  const model = new vosk.Model(modelPath);
  const wfReader = new wav.Reader();
  const wfReadable = new Readable().wrap(wfReader);
  const jsonTranscript: Promise<string> = new Promise((resolve) => {
    wfReader.on('format', async (res: any) => {
      if (res.audioFormat !== 1 || res.channels !== 1) {
        console.error('Audio file must be WAV format mono PCM.');
        process.exit(1);
      }

      const { sampleRate } = res;
      const rec = new vosk.Recognizer({ model, sampleRate });
      rec.setMaxAlternatives(1); // reduced from 10
      rec.setWords(true);
      rec.setPartialWords(true); // what is this idek
      // eslint-disable-next-line no-restricted-syntax
      for await (const data of wfReadable) {
        rec.acceptWaveform(data);
      }
      const transcript: string = JSON.stringify(rec.finalResult(rec), null, 4);
      rec.free();
      resolve(transcript);
    });
  });

  fs.createReadStream(filePath, { highWaterMark: 4096 })
    .pipe(wfReader)
    .on('finish', () => {
      model.free();
    });

  return jsonTranscript;
};

export default getVoskTranscript;
