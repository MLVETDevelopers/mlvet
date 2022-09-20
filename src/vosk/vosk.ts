/* eslint-disable max-classes-per-file */

import os from 'os';
import koffi from 'koffi';
import {
  Model,
  PartialResults,
  PLATFORMS,
  Recognizer,
  Result,
  SpeakerModel,
} from './helpers';
import { getDLLDir, updatePathWithDLLs } from './util';

const vosk = () => {
  const dllDir = getDLLDir();
  if (os.platform() === PLATFORMS.WINDOWS) {
    // Update PATH to load dependent dlls
    updatePathWithDLLs(dllDir);
  }

  const libvosk = koffi.load(dllDir);

  koffi.opaque('VoskModel');
  const modelPointer = koffi.pointer('void');
  koffi.opaque('VoskSpkModel');
  const spkModelPointer = koffi.pointer('void');
  koffi.opaque('VoskRecognizer');
  const recognizerPointer = koffi.pointer('void');

  koffi.opaque('data');
  const dataBuffer = koffi.pointer('void');

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
  const recognizerAcceptWaveform = libvosk.func(
    'vosk_recognizer_accept_waveform',
    'bool',
    [recognizerPointer, dataBuffer, 'int']
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
    const acceptWaveform = (data: Buffer) => {
      return recognizerAcceptWaveform(handle, data, data.length);
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
      resultString,
      result,
      partialResult,
      finalResult,
      reset,
    };
  };

  return { setLogLevel, createModel, createSpeakerModel, createRecognizer };
};

export default vosk;
