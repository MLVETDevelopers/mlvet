const fs = require('fs');
const { Readable } = require('stream');
const wav = require('wav');
const vosk = require('vosk');
const path = require('path');

// switch between files and models
const fileName = 'me-at-the-zoo.wav';
const modelName = 'vosk-large-model';

const MODEL_PATH = path.join(__dirname, modelName);
let FILE_PATH = path.join(__dirname, `../audioFiles/${fileName}`);

if (!fs.existsSync(MODEL_PATH)) {
  console.log('model not found at', MODEL_PATH);
  process.exit();
}

if (process.argv.length > 2) {
  // eslint-disable-next-line prefer-destructuring
  FILE_PATH = process.argv[2];
}

vosk.setLogLevel(0);
const model = new vosk.Model(MODEL_PATH);

const wfReader = new wav.Reader();
const wfReadable = new Readable().wrap(wfReader);

wfReader.on('format', async ({ audioFormat, sampleRate, channels }) => {
  // eslint-disable-next-line eqeqeq
  if (audioFormat != 1 || channels != 1) {
    console.error('Audio file must be WAV format mono PCM.');
    process.exit(1);
  }
  const rec = new vosk.Recognizer({ model, sampleRate });
  rec.setMaxAlternatives(1); // reduced from 10
  rec.setWords(true);
  rec.setPartialWords(true); // what is this idek
  // eslint-disable-next-line no-restricted-syntax
  for await (const data of wfReadable) {
    const endOfSpeech = rec.acceptWaveform(data);
  }
  console.log(JSON.stringify(rec.finalResult(rec), null, 4));
  rec.free();
});

fs.createReadStream(FILE_PATH, { highWaterMark: 4096 })
  .pipe(wfReader)
  .on('finish', () => {
    model.free();
  });
