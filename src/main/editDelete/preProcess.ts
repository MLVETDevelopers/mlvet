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
import { PAUSE_DEFAULT_THRESHOLD, PAUSE_MAX_THRESHOLD } from '../config';

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

const calculateBufferDurationBefore: (
  word: Word,
  prevWord: Word | null,
  bufferBeforePadding: number
) => number = (word, prevWord, bufferBeforePadding) => {
  if (prevWord === null) {
    return word.startTime;
  }
  const prevWordEndTime = prevWord.startTime + prevWord.duration;
  const gapTime = word.startTime - prevWordEndTime;

  // If the gap is less than the buffer padding, then bufferDurationBefore will equal whatever the gap is
  if (gapTime <= bufferBeforePadding) {
    return roundToMs(gapTime);
  }

  return roundToMs(bufferBeforePadding);
};

const calculateBufferDurationAfter: (
  word: Word,
  nextWord: Word | null,
  totalDuration: number,
  bufferBeforePadding: number
) => number = (word, nextWord, totalDuration, bufferBeforePadding) => {
  const wordEndTime = word.startTime + word.duration;

  if (nextWord === null) {
    return roundToMs(totalDuration - wordEndTime);
  }
  const gapTime = nextWord.startTime - wordEndTime;

  if (gapTime <= bufferBeforePadding) {
    return 0;
  }

  return roundToMs(gapTime - bufferBeforePadding);
};

/**
 * Adds silence buffers after words.
 * Buffer before is set to bufferBeforePadding (e.g. up to 0.2s)
 * Only the first word gets the full length of the buffer before it.
 */
const calculateBuffers: (totalDuration: number) => MapCallback<Word, Word> =
  (totalDuration) => (word, i, words) => {
    const isFirstWord = i === 0;
    const isLastWord = i === words.length - 1;
    const bufferBeforePadding = 0.2;

    const bufferDurationBefore = calculateBufferDurationBefore(
      word,
      isFirstWord ? null : words[i - 1],
      bufferBeforePadding
    );
    const bufferDurationAfter = calculateBufferDurationAfter(
      word,
      isLastWord ? null : words[i + 1],
      totalDuration,
      bufferBeforePadding
    );

    return {
      ...word,
      bufferDurationBefore,
      bufferDurationAfter,
    };
  };

const makePauseWord: (params: Pick<Word, 'startTime' | 'duration'>) => Word = ({
  startTime,
  duration,
}) => ({
  word: null,
  startTime,
  duration,
  outputStartTime: startTime,
  bufferDurationBefore: 0,
  bufferDurationAfter: 0,
  deleted: false,
  originalIndex: 0, // this gets fixed later
  confidence: 1,
  pasteKey: 0,
  takeInfo: null,
});

const injectPauses: (
  maxThreshold: number,
  defaultThreshold: number
) => MapCallback<Word, Word[]> =
  (
    maxThreshold = PAUSE_MAX_THRESHOLD,
    defaultThreshold = PAUSE_DEFAULT_THRESHOLD
  ) =>
  (currentWord) => {
    let pauseWordBefore: Word | null = null;
    let pauseWordAfter: Word | null = null;
    const currentWordWithReducedBuffer: Word = { ...currentWord };

    if (currentWord.bufferDurationBefore > maxThreshold) {
      currentWordWithReducedBuffer.bufferDurationBefore = defaultThreshold;

      const pauseWordStartTime =
        currentWord.startTime - currentWord.bufferDurationBefore;

      const bufferDiff = currentWord.bufferDurationBefore - defaultThreshold;

      pauseWordBefore = makePauseWord({
        startTime: roundToMs(pauseWordStartTime),
        duration: roundToMs(bufferDiff),
      });
    }

    if (currentWord.bufferDurationAfter > maxThreshold) {
      currentWordWithReducedBuffer.bufferDurationAfter = defaultThreshold;

      const pauseWordStartTime =
        currentWord.startTime + currentWord.duration + defaultThreshold;

      const bufferDiff = currentWord.bufferDurationAfter - defaultThreshold;

      pauseWordAfter = makePauseWord({
        startTime: roundToMs(pauseWordStartTime),
        duration: roundToMs(bufferDiff),
      });
    }

    return [
      pauseWordBefore,
      currentWordWithReducedBuffer,
      pauseWordAfter,
    ].filter(Boolean) as Word[];
  };

const combinePauses: (
  acc: Word[],
  currentWord: Word,
  index: number,
  words: Word[]
) => Word[] = (acc, currentWord, index, words) => {
  if (index === 0) {
    return [currentWord];
  }

  const prevWord = words[index - 1];

  if (currentWord.word === null && prevWord.word === null) {
    const combinedPause = {
      ...prevWord,
      duration: prevWord.duration + currentWord.duration,
    };
    return acc.slice(0, acc.length - 1).concat([combinedPause]);
  }

  return acc.concat([currentWord]);
};

/**
 * Adds back the outputStartTime and the original index to each word
 */
const recalculateAttributes: MapCallback<Word, Word> = (word, i) => ({
  ...word,
  outputStartTime: word.startTime,
  originalIndex: i,
});

/**
 * Pre processes a JSON transcript
 * @param jsonTranscript the JSON transcript input (technically a JS object but with some fields missing)
 * @param duration duration of the input media file
 * @returns formatted Transcript object
 */
const preProcessTranscript = (
  jsonTranscript: JSONTranscription,
  duration: number,
  maxThreshold: number = PAUSE_MAX_THRESHOLD,
  defaultThreshold: number = PAUSE_DEFAULT_THRESHOLD
): Transcription => {
  const wordsWithoutTakes = jsonTranscript.words
    .flatMap(injectAttributes)
    .map(calculateBuffers(duration))
    .flatMap(injectPauses(maxThreshold, defaultThreshold), [])
    .reduce<Word[]>(combinePauses, [])
    .map(recalculateAttributes);

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
