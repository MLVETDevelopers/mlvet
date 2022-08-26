import { updateOutputTimes } from '../../transcriptProcessing/updateOutputTimes';
import {
  MapCallback,
  PartialWord,
  ProcessedTranscription,
  TakeGroup,
  Transcription,
  Word,
} from '../../sharedTypes';
import { JSONTranscription } from '../types';
import punctuate from './punctuate';
import { roundToMs } from '../../sharedUtils';

/**
 * Injects extra attributes into a PartialWord to make it a full Word
 */
const injectAttributes: (fileName: string) => MapCallback<PartialWord, Word> =
  (fileName: string) => (word, index) => ({
    ...word,
    // eslint-disable-next-line react/destructuring-assignment
    outputStartTime: word.startTime,
    originalIndex: index,
    pasteKey: 0,
    deleted: false,
    fileName,
    // Buffers are calculated later
    bufferDurationBefore: 0,
    bufferDurationAfter: 0,
    takeInfo: null,
  });

const calculateAverageSilenceDuration = (
  jsonTranscription: JSONTranscription,
  totalDuration: number
): number => {
  let silenceSum = 0;
  for (let i = 0; i < jsonTranscription.words.length - 1; i += 1) {
    const endTime = jsonTranscription.words[i + 1].startTime;
    const silenceDuration =
      endTime -
      jsonTranscription.words[i].startTime -
      jsonTranscription.words[i].duration;
    silenceSum += silenceDuration;
  }
  return jsonTranscription.words.length !== 0
    ? silenceSum / jsonTranscription.words.length
    : totalDuration;
};

const calculateBufferDurationBefore: (
  word: Word,
  prevWord: Word | null
) => number = (word, prevWord) => {
  if (prevWord === null) {
    return word.startTime;
  }
  const prevWordEndTime = prevWord.startTime + prevWord.duration;
  const gapTime = word.startTime - prevWordEndTime;

  // Half the gap used by this word, half by the previous word.
  return roundToMs(gapTime / 2);
};

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

  // Half the gap used by this word, half by the next word.
  return roundToMs(gapTime / 2);
};

/**
 * Adds silence buffers before and after words.
 * For words in the middle of the transcript, the buffers are halved with the words
 * either side. For start/end words, they get the whole buffer to the start or end.
 */
const calculateBuffers: (totalDuration: number) => MapCallback<Word, Word> =
  (totalDuration) => (word, i, words) => {
    const isFirstWord = i === 0;
    const isLastWord = i === words.length - 1;

    const bufferDurationBefore = calculateBufferDurationBefore(
      word,
      isFirstWord ? null : words[i - 1]
    );
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
 * Pre processes a JSON transcript from python for use in the front end
 * @param jsonTranscript the JSON transcript input (technically a JS object but with some fields missing)
 * @param duration duration of the input media file
 * @returns formatted Transcript object
 */
const preProcessTranscript = (
  jsonTranscript: JSONTranscription,
  duration: number,
  fileName: string
): ProcessedTranscription => {
  // Note: This calculation should be inside punctuation
  const averageSilenceDuration: number = calculateAverageSilenceDuration(
    jsonTranscript,
    duration
  );

  // TODO(Kate): Take Detection function should be called here
  // Mock take groups
  const takeGroups: TakeGroup[] = [
    {
      id: 1,
      activeTakeIndex: 0,
      takeCount: 2,
    },
  ];

  return {
    transcription: {
      confidence: jsonTranscript.confidence,
      duration,
      ...updateOutputTimes(
        jsonTranscript.words
          .map(punctuate(duration, averageSilenceDuration))
          .flatMap(injectAttributes(fileName))
          .map(calculateBuffers(duration))
      ),
    },
    takeGroups,
  };
};

export default preProcessTranscript;
