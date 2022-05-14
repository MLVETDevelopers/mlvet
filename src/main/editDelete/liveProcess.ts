import { Transcription, Word } from 'sharedTypes';

/**
 * calculateTime calculates the outputStartTimes of a word based on the
 * current state of all words in a Transcript. It takes into account edits/deletes
 * @param word word in Transcript
 * @param i the current index position in the words array
 * @param words an array of words from Transcript
 * @returns the input word with an updated outputStartTime
 *
 */

const calculateTime = (word: Word, i: number, words: Word[]): Word => {
  if (!word.deleted) {
    if (i === 0) {
      word.outputStartTime = 0;
    } else {
      let j = i - 1;
      while (j > -1 && words[j].deleted) {
        j -= 1;
      }
      if (j === -1) {
        word.outputStartTime = 0;
      } else {
        word.outputStartTime = words[j].outputStartTime + words[j].duration;
      }
    }
  }
  return word;
};

/**
 * Processes a Transcript so that all words have the correct outputStartTime
 * @param transcript The original Transcript object
 * @returns The Transcript object with updated outputStartTime for all words
 */
const liveProcessTranscript = (transcript: Transcription): Transcription => {
  transcript.words.map(calculateTime);
  return transcript;
};

export default liveProcessTranscript;
