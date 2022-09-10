/* eslint-disable max-classes-per-file */

import * as os from 'os';
import path from 'path';
import koffi from 'koffi';

// const vosk_model = ref.types.void;
// const vosk_model_ptr = ref.refType(vosk_model);
// const vosk_spk_model = ref.types.void;
// const vosk_spk_model_ptr = ref.refType(vosk_spk_model);
// const vosk_recognizer = ref.types.void;
// const vosk_recognizer_ptr = ref.refType(vosk_recognizer);

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
  acceptWaveform: (waveform: Buffer) => boolean;
  result: () => string;
  finalResult: () => string;
  partialResult: () => string;
  reset: () => void;
}

let soname;
if (os.platform() === PLATFORMS.WINDOWS) {
  // Update path to load dependent dlls
  const currentPath = process.env.Path;
  const dllDirectory = path.resolve(path.join(__dirname, 'lib', 'win-x86_64'));
  process.env.Path = currentPath + path.delimiter + dllDirectory;

  soname = path.join(__dirname, 'lib', 'win-x86_64', 'libvosk.dll');
} else if (os.platform() === PLATFORMS.MAC) {
  soname = path.join(__dirname, 'lib', 'osx-universal', 'libvosk.dylib');
} else {
  soname = path.join(__dirname, 'lib', 'linux-x86_64', 'libvosk.so');
}

const libvosk = koffi.load(soname);

/* eslint-disable @typescript-eslint/naming-convention */
// const vosk_model = 'void';
const vosk_model_ptr = koffi.opaque('vosk_model');
// const vosk_spk_model = 'void';
const vosk_spk_model_ptr = koffi.opaque('vosk_spk_model');
// const vosk_recognizer = 'void';
const vosk_recognizer_ptr = koffi.opaque('vosk_recognizer');

// Basic vosk model DLL functions
const vosk_set_log_level = libvosk.func('vosk_set_log_level', 'void', ['int']);
const vosk_model_new = libvosk.func('vosk_model_new', vosk_model_ptr, [
  'string',
]);
const vosk_model_free = libvosk.func('vosk_model_free', 'void', [
  vosk_model_ptr,
]);

// Vosk speaker model DLL functions
const vosk_spk_model_new = libvosk.func(
  'vosk_spk_model_new',
  vosk_spk_model_ptr,
  ['string']
);
const vosk_spk_model_free = libvosk.func('vosk_spk_model_free', 'void', [
  vosk_spk_model_ptr,
]);

// Vosk recognizer model DLL functions
const vosk_recognizer_new = libvosk.func(
  'vosk_recognizer_new',
  vosk_recognizer_ptr,
  [vosk_model_ptr, 'float']
);
const vosk_recognizer_new_spk = libvosk.func(
  'vosk_recognizer_new_spk',
  vosk_recognizer_ptr,
  [vosk_model_ptr, 'float', vosk_spk_model_ptr]
);
const vosk_recognizer_free = libvosk.func('vosk_recognizer_free', 'void', [
  vosk_recognizer_ptr,
]);
const vosk_recognizer_set_max_alternatives = libvosk.func(
  'vosk_recognizer_set_max_alternatives',
  'void',
  [vosk_recognizer_ptr, 'int']
);
const vosk_recognizer_set_words = libvosk.func(
  'vosk_recognizer_set_words',
  'void',
  [vosk_recognizer_ptr, 'bool']
);
const vosk_recognizer_set_partial_words = libvosk.func(
  'vosk_recognizer_set_partial_words',
  'void',
  [vosk_recognizer_ptr, 'bool']
);
const vosk_recognizer_set_spk_model = libvosk.func(
  'vosk_recognizer_set_spk_model',
  'void',
  [vosk_recognizer_ptr, vosk_spk_model_ptr]
);
const vosk_recognizer_accept_waveform = libvosk.func(
  'vosk_recognizer_accept_waveform',
  'bool',
  [vosk_recognizer_ptr, 'pointer', 'int']
);
const vosk_recognizer_result = libvosk.func(
  'vosk_recognizer_result',
  'string',
  [vosk_recognizer_ptr]
);
const vosk_recognizer_final_result = libvosk.func(
  'vosk_recognizer_final_result',
  'string',
  [vosk_recognizer_ptr]
);
const vosk_recognizer_partial_result = libvosk.func(
  'vosk_recognizer_partial_result',
  'string',
  [vosk_recognizer_ptr]
);
const vosk_recognizer_reset = libvosk.func('vosk_recognizer_reset', 'void', [
  vosk_recognizer_ptr,
]);

/* eslint-enable @typescript-eslint/naming-convention */

/**
 * Set log level for Kaldi messages
 * @param {number} level The higher, the more verbose. 0 for infos and errors. Less than 0 for silence.
 */
export const setLogLevel = (level: number) => {
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
export const useModel = (modelPath: string): Model => {
  const handle = vosk_model_new(modelPath);
  if (handle === null) {
    throw new Error(`Failed to load model at ${modelPath}`);
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

/**
 * Build a Speaker Model from a speaker model file.
 * The Speaker Model enables speaker identification.
 * @param {string} modelPath the path of the model on the filesystem
 * @see models [models](https://alphacephei.com/vosk/models)
 */
export const useSpeakerModel = (modelPath: string): SpeakerModel => {
  const handle = vosk_spk_model_new(modelPath);
  if (handle === null) {
    throw new Error(`Failed to load speaker model at ${modelPath}`);
  }

  /**
   * Releases the model memory
   *
   * The model object is reference-counted so if some recognizer
   * depends on this model, model might still stay alive. When
   * last recognizer is released, model will be released too.
   */
  const free = () => vosk_spk_model_free(handle);

  return { handle, free };
};

/**
 * Create a Recognizer that will be able to transform audio streams into text using a Model.
 * @template {XOR<SpeakerRecognizerParam, Partial<GrammarRecognizerParam>>} T extra parameter
 * @see Model
 */
export const useRecognizer = (
  model: Model,
  sampleRate: number,
  speakerModel?: SpeakerModel
): Recognizer => {
  // Prevent the user to receive unpredictable results
  // if (
  //   hasOwnProperty(param, 'speakerModel') &&
  //   hasOwnProperty(param, 'grammar')
  // ) {
  //   throw new Error(
  //     'grammar and speakerModel cannot be used together for now.'
  //   );
  // }

  const handle =
    typeof speakerModel !== 'undefined'
      ? vosk_recognizer_new_spk(model.handle, sampleRate, speakerModel.handle)
      : vosk_recognizer_new(model.handle, sampleRate);

  /**
   * Releases the model memory
   *
   * The model object is reference-counted so if some recognizer
   * depends on this model, model might still stay alive. When
   * last recognizer is released, model will be released too.
   */
  const free = () => vosk_recognizer_free(handle);

  /** Configures recognizer to output n-best results
   *
   * <pre>
   *   {
   *      "alternatives": [
   *          { "text": "one two three four five", "confidence": 0.97 },
   *          { "text": "one two three for five", "confidence": 0.03 },
   *      ]
   *   }
   * </pre>
   *
   * @param max_alternatives - maximum alternatives to return from recognition results
   */
  const setMaxAlternatives = (maxAlternatives: number) =>
    vosk_recognizer_set_max_alternatives(handle, maxAlternatives);

  /** Configures recognizer to output words with times
   *
   * <pre>
   *   "result" : [{
   *       "conf" : 1.000000,
   *       "end" : 1.110000,
   *       "start" : 0.870000,
   *       "word" : "what"
   *     }, {
   *       "conf" : 1.000000,
   *       "end" : 1.530000,
   *       "start" : 1.110000,
   *       "word" : "zero"
   *     }, {
   *       "conf" : 1.000000,
   *       "end" : 1.950000,
   *       "start" : 1.530000,
   *       "word" : "zero"
   *     }, {
   *       "conf" : 1.000000,
   *       "end" : 2.340000,
   *       "start" : 1.950000,
   *       "word" : "zero"
   *     }, {
   *       "conf" : 1.000000,
   *       "end" : 2.610000,
   *       "start" : 2.340000,
   *       "word" : "one"
   *     }],
   * </pre>
   *
   * @param words - boolean value
   */
  const setWords = (words: boolean) => vosk_recognizer_set_words(handle, words);

  /** Same as above, but for partial results */
  const setPartialWords = (partialWords: boolean) =>
    vosk_recognizer_set_partial_words(handle, partialWords);

  /** Adds speaker recognition model to already created recognizer. Helps to initialize
   * speaker recognition for grammar-based recognizer.
   *
   * @param spk_model Speaker recognition model
   */
  const setSpkModel = (spk_model: SpeakerModel) => {
    vosk_recognizer_set_spk_model(handle, spk_model.handle);
  };

  /**
   * Accept voice data
   *
   * accept and process new chunk of voice data
   *
   * @param {Buffer} data audio data in PCM 16-bit mono format
   * @returns true if silence is occured and you can retrieve a new utterance with result method
   */
  const acceptWaveform = (data: Buffer) => {
    return vosk_recognizer_accept_waveform(handle, data, data.length);
  };

  /** Returns speech recognition result in a string
   *
   * @returns the result in JSON format which contains decoded line, decoded
   *          words, times in seconds and confidences. You can parse this result
   *          with any json parser
   * <pre>
   * {
   *   "result" : [{
   *       "conf" : 1.000000,
   *       "end" : 1.110000,
   *       "start" : 0.870000,
   *       "word" : "what"
   *     }, {
   *       "conf" : 1.000000,
   *       "end" : 1.530000,
   *       "start" : 1.110000,
   *       "word" : "zero"
   *     }, {
   *       "conf" : 1.000000,
   *       "end" : 1.950000,
   *       "start" : 1.530000,
   *       "word" : "zero"
   *     }, {
   *       "conf" : 1.000000,
   *       "end" : 2.340000,
   *       "start" : 1.950000,
   *       "word" : "zero"
   *     }, {
   *       "conf" : 1.000000,
   *      "end" : 2.610000,
   *       "start" : 2.340000,
   *       "word" : "one"
   *     }],
   *   "text" : "what zero zero zero one"
   *  }
   * </pre>
   */
  const resultString = (): string => {
    return vosk_recognizer_result(handle);
  };

  /**
   * Returns speech recognition results
   * @returns {Result} The results
   */
  const result = (): Result => {
    return JSON.parse(vosk_recognizer_result(handle));
  };

  /**
   * speech recognition text which is not yet finalized.
   * result may change as recognizer process more data.
   *
   * @returns {PartialResults} The partial results
   */
  const partialResult = (): PartialResults => {
    return JSON.parse(vosk_recognizer_partial_result(handle));
  };

  /**
   * Returns speech recognition result. Same as result, but doesn't wait for silence
   * You usually call it in the end of the stream to get final bits of audio. It
   * flushes the feature pipeline, so all remaining audio chunks got processed.
   *
   * @returns {Result} speech result.
   */
  const finalResult = (): Result => {
    return JSON.parse(vosk_recognizer_final_result(handle));
  };

  /**
   * Resets current results so the recognition can continue from scratch
   */
  const reset = () => {
    vosk_recognizer_reset(handle);
  };

  return {
    handle,
    free,
    setMaxAlternatives,
    setWords,
    setPartialWords,
    setSpkModel,
    acceptWaveform,
    resultString,
    result,
    partialResult,
    finalResult,
    reset,
  };
};
