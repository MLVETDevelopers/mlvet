import fs from 'fs';
import { WaveFile } from 'wavefile';
import { Readable } from 'stream';
import createVosky from '../../vosk/vosky';

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
  const vosky = createVosky();

  vosky.setLogLevel(0);

  const model = vosky.createModel(modelPath);

  const wav = new WaveFile();
  wav.fromBuffer(fs.readFileSync(filePath));

  const wavFormat = wav.fmt as WaveFormat;
  if (wavFormat.audioFormat !== 1 || wavFormat.numChannels !== 1) {
    console.error('Audio file must be WAV format mono PCM.');
    process.exit(1);
  }

  const voskRecognizer = vosky.createRecognizer(model, 16000);

  voskRecognizer.setMaxAlternatives(2); // reduced from 10
  voskRecognizer.setWords(true);

  const audioBuffer = fs.readFileSync(filePath);

  // audioBuffer.forEach((b) => {
  //   voskRecognizer.acceptWaveformAsString(b.toString());
  // });

  const wavData = wav.data as WaveData;

  // const acceptWaveform = () => {
  //   return new Promise<void>((resolve, reject) => {
  //     const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

  //     readStream.on('data', (chunk) => {
  //       voskRecognizer.acceptWaveformAsString(chunk.toString());
  //     });

  //     readStream.on('error', (e) => {
  //       reject(e);
  //     });

  //     readStream.on('end', () => {
  //       resolve();
  //     });
  //   });
  // };

  // await acceptWaveform();

  // voskRecognizer.setPartialWords(true);

  voskRecognizer.acceptWaveform(audioBuffer);

  const result = JSON.parse(voskRecognizer.resultString());

  const transcript: string = JSON.stringify(result, null, 4);

  voskRecognizer.free();
  model.free();

  return transcript;
};

export default getVoskTranscript;