import { updateOutputTimes } from '../../transcriptProcessing/updateOutputTimes';
import {
  MapCallback,
  PartialWord,
  Transcription,
  Word,
} from '../../sharedTypes';
import { JSONTranscription } from '../types';
import { roundToMs } from '../../sharedUtils';
import injectTakeInfo from './injectTakeInfo';
import { findTakes } from '../takeDetection/takeDetection';

/**
 * Injects extra attributes into a PartialWord to make it a full Word
 */
const injectAttributes: MapCallback<PartialWord, Word> = (word, index) => ({
  ...word,
  // eslint-disable-next-line react/destructuring-assignment
  outputStartTime: word.startTime,
  originalIndex: index,
  pasteKey: 0,
  deleted: false,
  confidence: word.confidence,
  // Buffers are calculated later
  bufferDurationBefore: 0,
  bufferDurationAfter: 0,
  takeInfo: null,
});

const calculateBufferDurationAfter: (
  word: Word,
  nextWord: Word | null,
  totalDuration: number
) => number = (word, nextWord, totalDuration) => {
  const wordEndTime = word.startTime + word.duration;

  if (nextWord === null) {
    return totalDuration - wordEndTime;
  }
  const gapTime = nextWord.startTime - wordEndTime;

  return roundToMs(gapTime);
};

/**
 * Adds silence buffers after words.
 * Only the first word gets a buffer before it.
 */
const calculateBuffers: (totalDuration: number) => MapCallback<Word, Word> =
  (totalDuration) => (word, i, words) => {
    const isFirstWord = i === 0;
    const isLastWord = i === words.length - 1;

    const bufferDurationBefore = isFirstWord ? word.startTime : 0;
    const bufferDurationAfter = calculateBufferDurationAfter(
      word,
      isLastWord ? null : words[i + 1],
      totalDuration
    );

    return {
      ...word,
      bufferDurationBefore,
      bufferDurationAfter,
    };
  };

/**
 * Pre processes a JSON transcript
 * @param jsonTranscript the JSON transcript input (technically a JS object but with some fields missing)
 * @param duration duration of the input media file
 * @returns formatted Transcript object
 */
const preProcessTranscript = (
  jsonTranscript: JSONTranscription,
  duration: number
): Transcription => {
  const wordsWithoutTakes = jsonTranscript.words
    .flatMap(injectAttributes)
    .map(calculateBuffers(duration));

  const injectableTakeGroups = findTakes(wordsWithoutTakes);

  const { words, takeGroups } = injectTakeInfo(
    wordsWithoutTakes,
    injectableTakeGroups
  );

  return {
    duration,
    ...updateOutputTimes(words, takeGroups),
    takeGroups,
  };
};

export default preProcessTranscript;
