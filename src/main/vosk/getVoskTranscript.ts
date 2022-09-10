import fs from 'fs';
import { WaveFile } from 'wavefile';
// import { setLogLevel, createModel, getSoname } from '../../vosk';
// import * as hello from '../../vosk/hello';
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
  console.log('1');

  const vosky = createVosky();

  vosky.setLogLevel(0);

  console.log('2');

  const model = vosky.createModel(modelPath);

  console.log('3');

  const wav = new WaveFile();
  wav.fromBuffer(fs.readFileSync(filePath));

  const wavFormat = wav.fmt as WaveFormat;
  if (wavFormat.audioFormat !== 1 || wavFormat.numChannels !== 1) {
    console.error('Audio file must be WAV format mono PCM.');
    process.exit(1);
  }

  console.log('4');

  // const voskRecognizer = createRecognizer(model, 16000);
  // const voskRecognizer = {};

  // console.log('5');

  // voskRecognizer.setMaxAlternatives(1); // reduced from 10
  // voskRecognizer.setWords(true);
  // voskRecognizer.setPartialWords(true); // what is this idek

  // const wavData = wav.data as WaveData;
  // voskRecognizer.acceptWaveform(wavData.samples);

  // const transcript: string = JSON.stringify(
  //   voskRecognizer.finalResult(),
  //   null,
  //   4
  // );

  // voskRecognizer.free();
  // model.free();

  // return transcript;

  return '';
};

export default getVoskTranscript;
