import fs from 'fs';
import { WaveFile } from 'wavefile';
import vosk from 'vosk';

interface WaveFormat {
  audioFormat: number;
  numChannels: number;
  sampleRate: number;
  byteRate: number;
  blockAlign: number;
  bitsPerSample: number;
  extraParams: number[];
}

interface WaveData {
  chunkId: string;
  chunkSize: number;
  samples: number[];
}

const getVoskTranscript = async (modelPath: string, filePath: string) => {
  vosk.setLogLevel(-1);
  const model = new vosk.Model(modelPath);

  const wav = new WaveFile();
  wav.fromBuffer(fs.readFileSync(filePath));

  const wavFormat = wav.fmt as WaveFormat;
  if (wavFormat.audioFormat !== 1 || wavFormat.numChannels !== 1) {
    console.error('Audio file must be WAV format mono PCM.');
    process.exit(1);
  }

  console.log('=========================================================');
  console.log(modelPath);
  console.log(filePath);
  console.log(model);
  console.log('=========================================================');

  const rec = new vosk.Recognizer({ model, sampleRate: 16000 });
  rec.setMaxAlternatives(1); // reduced from 10
  rec.setWords(true);
  rec.setPartialWords(true); // what is this idek

  console.log('===================================================');
  console.log('got here');

  const wavData = wav.data as WaveData;

  console.log(wavData);

  rec.acceptWaveform(wavData.samples);

  const transcript: string = JSON.stringify(rec.finalResult(rec), null, 4);

  rec.free();
  model.free();

  return transcript;
};

export default getVoskTranscript;
