import { bufferedWordDuration, roundToMs } from '../sharedUtils';
import { Word } from '../sharedTypes';

/**
 * calculates the outputStartTimes of a word based on the
 * current state of all words in a Transcript. It takes into account edits/deletes.
 * @param word word in Transcript
 * @param i the current index position in the words array
 * @param words an array of words from Transcript
 * @returns the updated outputStartTime
 */
export const calculateTime: (
  word: Word,
  i: number,
  newWords: Word[]
) => number = (word, i, newWords) => {
  // if the word is deleted, this never gets read, so it doesn't matter what it's set to
  if (word.deleted) {
    return 0;
  }

  // If the word is the first word, the output start time should include the buffer.
  // Currently, this just equates to zero
  if (i === 0) {
    return 0;
  }

  // if the word is later in the array, calculate outputStartTime using the closest non-deleted word before the current word
  let nextNotDeleted = i - 1;

  // keeping going back until there are no more words or an un-deleted word is found
  while (nextNotDeleted > -1 && newWords[nextNotDeleted].deleted) {
    nextNotDeleted -= 1;
  }

  // if no un-deleted words are found, the current word becomes the starting word
  if (nextNotDeleted === -1) {
    return 0;
  }

  // otherwise, use the closest un-deleted word
  const prevWord = newWords[nextNotDeleted];
  return roundToMs(prevWord.outputStartTime + bufferedWordDuration(prevWord));
};

const updateOutputVideoDuration: (words: Word[]) => number = (words) => {
  const currentTranscriptWords = words.filter((word) => word.deleted === false);
  const lastWord = currentTranscriptWords.pop();

  if (lastWord) {
    return roundToMs(lastWord.outputStartTime + bufferedWordDuration(lastWord));
  }

  // If there are no words in the filtered word list, we assume duration is 0
  return 0;
};

/**
 * Updates the output start times for each of the words in the transcript
 */
export const updateOutputTimes: (words: Word[]) => {
  words: Word[];
  outputDuration: number;
} = (words) => {
  const newWords: Word[] = [];

  // Using this instead of map because the calculateTime function needs the
  // latest start times, yet we still want to work immutably as this is part of
  // a redux reducer
  words.forEach((word, i) => {
    newWords.push({
      ...word,
      outputStartTime: calculateTime(word, i, newWords),
    });
  });

  return {
    words: newWords,
    outputDuration: updateOutputVideoDuration(newWords),
  };
};
