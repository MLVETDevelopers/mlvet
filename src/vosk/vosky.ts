/* eslint-disable max-classes-per-file */

import * as os from 'os';
import path from 'path';
import koffi from 'koffi';

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
  acceptWaveformAsString: (waveform: string | Buffer) => boolean;
  acceptWaveformAsFloatArr: (waveform: Buffer) => boolean;
  acceptWaveformAsShortArr: (waveform: Buffer) => boolean;
  resultString: () => string;
  result: () => Result;
  finalResult: () => Result;
  partialResult: () => PartialResults;
  reset: () => void;
}

const getDLLDir = () => {
  // Path is different in dev than in production
  const prodPath = process.env.NODE_ENV === 'development' ? '.' : '../.';

  const baseDllPath = path.join(
    __dirname,
    '../../.',
    prodPath,
    'assets/vosk',
    'lib'
  );

  let dllDir;
  if (os.platform() === PLATFORMS.WINDOWS) {
    // Update path to load dependent dlls
    const currentPath = process.env.Path;

    const dllDirectory = path.resolve(path.join(baseDllPath, 'win-x86_64'));
    process.env.Path = currentPath + path.delimiter + dllDirectory;

    dllDir = path.join(baseDllPath, 'win-x86_64', 'libvosk.dll');
  } else if (os.platform() === PLATFORMS.MAC) {
    dllDir = path.join(baseDllPath, 'osx-universal', 'libvosk.dylib');
  } else {
    dllDir = path.join(baseDllPath, 'linux-x86_64', 'libvosk.so');
  }
  return dllDir;
};

const vosky = () => {
  const dllDir = getDLLDir();

  const libvosk = koffi.load(dllDir);

  koffi.opaque('VoskModel');
  const modelPointer = koffi.pointer('void');
  koffi.opaque('VoskSpkModel');
  const spkModelPointer = koffi.pointer('void');
  koffi.opaque('VoskRecognizer');
  const recognizerPointer = koffi.pointer('void');

  const setLogLevelDebug = libvosk.func('vosk_set_log_level', 'void', ['int']);

  const newModel = libvosk.func('vosk_model_new', modelPointer, ['string']);
  const freeModel = libvosk.func('vosk_model_free', 'void', [modelPointer]);

  // Vosk speaker model DLL functions
  const newSpkModel = libvosk.func('vosk_spk_model_new', spkModelPointer, [
    'string',
  ]);
  const freeSpkModel = libvosk.func('vosk_spk_model_free', 'void', [
    spkModelPointer,
  ]);

  // Vosk recognizer model DLL functions
  const newRecognizer = libvosk.func('vosk_recognizer_new', recognizerPointer, [
    modelPointer,
    'float',
  ]);
  const newSpkRecognizer = libvosk.func(
    'vosk_recognizer_new_spk',
    recognizerPointer,
    [modelPointer, 'float', spkModelPointer]
  );
  const freeRecognizer = libvosk.func('vosk_recognizer_free', 'void', [
    recognizerPointer,
  ]);
  const recognizerSetMaxAlternatives = libvosk.func(
    'vosk_recognizer_set_max_alternatives',
    'void',
    [recognizerPointer, 'int']
  );
  const recognizerSetWords = libvosk.func('vosk_recognizer_set_words', 'void', [
    recognizerPointer,
    'bool',
  ]);
  const recognizerSetPartialWords = libvosk.func(
    'vosk_recognizer_set_partial_words',
    'void',
    [recognizerPointer, 'bool']
  );
  const recognizerSetSpkModel = libvosk.func(
    'vosk_recognizer_set_spk_model',
    'void',
    [recognizerPointer, spkModelPointer]
  );
  const recognizerAcceptWaveformString = libvosk.func(
    'vosk_recognizer_accept_waveform',
    'bool',
    [recognizerPointer, 'char *', 'int']
  );
  const recognizerAcceptWaveformFloatArr = libvosk.func(
    'vosk_recognizer_accept_waveform_f',
    'bool',
    [recognizerPointer, 'float *', 'int']
  );
  const recognizerAcceptWaveformShortArr = libvosk.func(
    'vosk_recognizer_accept_waveform_s',
    'bool',
    [recognizerPointer, 'short *', 'int']
  );
  const recognizerResult = libvosk.func('vosk_recognizer_result', 'string', [
    recognizerPointer,
  ]);
  const recognizerFinalResult = libvosk.func(
    'vosk_recognizer_final_result',
    'string',
    [recognizerPointer]
  );
  const recognizerPartialResult = libvosk.func(
    'vosk_recognizer_partial_result',
    'string',
    [recognizerPointer]
  );
  const recognizerReset = libvosk.func('vosk_recognizer_reset', 'void', [
    recognizerPointer,
  ]);

  /**
   * Set log level for Kaldi messages
   * @param {number} level The higher, the more verbose. 0 for infos and errors. Less than 0 for silence.
   */
  const setLogLevel = (level: number) => {
    setLogLevelDebug(level);
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
    const handle = newModel(modelPath);
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
    const free = () => freeModel(handle);

    return { handle, free };
  };

  /**
   * Build a Speaker Model from a speaker model file.
   * The Speaker Model enables speaker identification.
   * @param {string} modelPath the path of the model on the filesystem
   * @see models [models](https://alphacephei.com/vosk/models)
   */
  const createSpeakerModel = (modelPath: string): SpeakerModel => {
    const handle = newSpkModel(modelPath);
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
    const free = () => freeSpkModel(handle);

    return { handle, free };
  };

  /**
   * Create a Recognizer that will be able to transform audio streams into text using a Model.
   * @template {XOR<SpeakerRecognizerParam, Partial<GrammarRecognizerParam>>} T extra parameter
   * @see Model
   */
  const createRecognizer = (
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
        ? newSpkRecognizer(model.handle, sampleRate, speakerModel.handle)
        : newRecognizer(model.handle, sampleRate);

    /**
     * Releases the model memory
     *
     * The model object is reference-counted so if some recognizer
     * depends on this model, model might still stay alive. When
     * last recognizer is released, model will be released too.
     */
    const free = () => freeRecognizer(handle);

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
      recognizerSetMaxAlternatives(handle, maxAlternatives);

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
    const setWords = (words: boolean) => recognizerSetWords(handle, words);

    /** Same as above, but for partial results */
    const setPartialWords = (partialWords: boolean) =>
      recognizerSetPartialWords(handle, partialWords);

    /** Adds speaker recognition model to already created recognizer. Helps to initialize
     * speaker recognition for grammar-based recognizer.
     *
     * @param spk_model Speaker recognition model
     */
    const setSpkModel = (spk_model: SpeakerModel) => {
      recognizerSetSpkModel(handle, spk_model.handle);
    };

    /**
     * Accept voice data
     *
     * accept and process new chunk of voice data
     *
     * @param {Buffer} data audio data in PCM 16-bit mono format
     * @returns true if silence is occured and you can retrieve a new utterance with result method
     */
    const acceptWaveformAsString = (data: string | Buffer) => {
      return recognizerAcceptWaveformString(handle, data, data.length);
    };

    const acceptWaveform = (data: Buffer) => {
      return recognizerAcceptWaveformString(
        handle,
        data.toString('base64'),
        data.byteLength
      );
    };

    /**
     * Accept voice data
     *
     * accept and process new chunk of voice data
     *
     * @param {Buffer} data audio data in PCM 16-bit mono format
     * @returns true if silence is occured and you can retrieve a new utterance with result method
     */
    const acceptWaveformAsFloatArr = (data: Buffer) => {
      return recognizerAcceptWaveformFloatArr(handle, data, data.length);
    };

    /**
     * Accept voice data
     *
     * accept and process new chunk of voice data
     *
     * @param {Buffer} data audio data in PCM 16-bit mono format
     * @returns true if silence is occured and you can retrieve a new utterance with result method
     */
    const acceptWaveformAsShortArr = (data: Buffer) => {
      return recognizerAcceptWaveformShortArr(handle, data, data.byteLength);
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
      return recognizerResult(handle);
    };

    /**
     * Returns speech recognition results
     * @returns {Result} The results
     */
    const result = (): Result => {
      return JSON.parse(recognizerResult(handle));
    };

    /**
     * speech recognition text which is not yet finalized.
     * result may change as recognizer process more data.
     *
     * @returns {PartialResults} The partial results
     */
    const partialResult = (): PartialResults => {
      return JSON.parse(recognizerPartialResult(handle));
    };

    /**
     * Returns speech recognition result. Same as result, but doesn't wait for silence
     * You usually call it in the end of the stream to get final bits of audio. It
     * flushes the feature pipeline, so all remaining audio chunks got processed.
     *
     * @returns {Result} speech result.
     */
    const finalResult = (): Result => {
      return JSON.parse(recognizerFinalResult(handle));
    };

    /**
     * Resets current results so the recognition can continue from scratch
     */
    const reset = () => {
      recognizerReset(handle);
    };

    return {
      handle,
      free,
      setMaxAlternatives,
      setWords,
      setPartialWords,
      setSpkModel,
      acceptWaveform,
      acceptWaveformAsString,
      acceptWaveformAsFloatArr,
      acceptWaveformAsShortArr,
      resultString,
      result,
      partialResult,
      finalResult,
      reset,
    };
  };

  return { setLogLevel, createModel, createSpeakerModel, createRecognizer };
};

export default vosky;
