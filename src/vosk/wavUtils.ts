import { WaveFile } from 'wavefile';

interface WaveFormat {
  audioFormat: number;
  numChannels: number;
  sampleRate: number;
  byteRate: number;
  blockAlign: number;
  bitsPerSample: number;
  extraParams: number[];
}

/**
 * Checks the wav file format/headers will work with Vosk models
 */
// eslint-disable-next-line import/prefer-default-export
export const checkWavFile = (wavFileBuffer: Buffer) => {
  const wav = new WaveFile();
  wav.fromBuffer(wavFileBuffer);
  const wavFormat = wav.fmt as WaveFormat;
  if (wavFormat.audioFormat !== 1 || wavFormat.numChannels !== 1) {
    console.error('Audio file must be WAV format mono PCM.');
    process.exit(1);
  }
};
