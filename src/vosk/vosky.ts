/* eslint-disable max-classes-per-file */

import * as os from 'os';
import path from 'path';
import koffi from 'koffi';
// import ref from 'ref-napi';

const PLATFORMS = {
  WINDOWS: 'win32',
  LINUX: 'linux',
  MAC: 'darwin',
};

interface WordResult {
  // The confidence rate in the detection. 0 For unlikely, and 1 for totally accurate
  conf: number;
  // The start of the timeframe when the word is pronounced in seconds
  start: number;
  // The end of the timeframe when the word is pronounced in seconds
  end: number;
  // The word detected
  word: string;
}

interface RecognitionResults {
  // Details about the words that have been detected
  result: WordResult[];
  // The complete sentence that have been detected
  text: string;
}

interface SpeakerResults {
  // A floating vector representing speaker identity.
  // It is usually about 128 numbers which uniquely represent speaker voice
  spk: number[];
  // The number of frames used to extract speaker vector.
  // The more frames you have the more reliable is speaker vector
  spk_frames: number;
}

type Result = (SpeakerResults & RecognitionResults) | RecognitionResults;

interface PartialResults {
  // The partial sentence that have been detected until now
  partial: string;
}

interface Model {
  handle: any;
  free: () => void;
}

interface SpeakerModel {
  handle: any;
  free: () => void;
}

interface Recognizer {
  handle: any;
  free: () => void;
  setMaxAlternatives: (maxAlternatives: number) => void;
  setWords: (words: boolean) => void;
  setPartialWords: (partialWords: boolean) => void;
  setSpkModel: (spkModel: SpeakerModel) => void;
  acceptWaveform: (waveform: Buffer | number[]) => boolean;
  resultString: () => string;
  result: () => Result;
  finalResult: () => Result;
  partialResult: () => PartialResults;
  reset: () => void;
}

const getSoname = () => {
  let test;
  if (os.platform() === PLATFORMS.WINDOWS) {
    // Update path to load dependent dlls
    const currentPath = process.env.Path;
    const dllDirectory = path.resolve(
      path.join(__dirname, 'lib', 'win-x86_64')
    );
    process.env.Path = currentPath + path.delimiter + dllDirectory;

    test = path.join(__dirname, 'lib', 'win-x86_64', 'libvosk.dll');
  } else if (os.platform() === PLATFORMS.MAC) {
    test = path.join(__dirname, 'lib', 'osx-universal', 'libvosk.dylib');
  } else {
    test = path.join(__dirname, 'lib', 'linux-x86_64', 'libvosk.so');
  }
  return test;
};

const vosky = () => {
  const soname = getSoname();

  const libvosk = koffi.load(soname);

  // koffi.pointer(koffi.opaque('VoskModel'), 2);

  koffi.opaque('VoskModel');

  /* eslint-disable @typescript-eslint/naming-convention */

  const vosk_set_log_level = libvosk.func('vosk_set_log_level', 'void', [
    'int',
  ]);

  // const vosk_model_new = libvosk.func(
  //   'vosk_model_new',
  //   koffi.inout(koffi.pointer(VoskModel)),
  //   ['string']
  // );

  const vosk_model_new = libvosk.func(
    'VoskModel *vosk_model_new(const char *model_path)'
  );

  const vosk_model_free = libvosk.func(
    'void vosk_model_free(VoskModel *model)'
  );

  /* eslint-enable @typescript-eslint/naming-convention */

  /**
   * Set log level for Kaldi messages
   * @param {number} level The higher, the more verbose. 0 for infos and errors. Less than 0 for silence.
   */
  const setLogLevel = (level: number) => {
    vosk_set_log_level(level);
  };

  /**
   * Build a Model from a model file.
   * Build a Model to be used with the voice recognition. Each language should have it's own Model
   * for the speech recognition to work.
   * @param {string} modelPath The abstract pathname to the model
   * @see models [models](https://alphacephei.com/vosk/models)
   * @returns {Model} The model to be used with the voice recognition
   */
  const createModel = (modelPath: string): Model => {
    console.log('3');
    const handle = vosk_model_new(modelPath);
    console.log('4');
    if (handle === null) {
      console.log(`Failed to load model at ${modelPath}`);
    }

    /**
     * Releases the model memory
     *
     * The model object is reference-counted so if some recognizer
     * depends on this model, model might still stay alive. When
     * last recognizer is released, model will be released too.
     */
    const free = () => vosk_model_free(handle);

    return { handle, free };
  };

  return { setLogLevel, createModel };
};

export default vosky;
