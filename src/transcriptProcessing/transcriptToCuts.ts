import { updateOutputTimes } from './updateOutputTimes';
import { Transcription, Cut } from '../sharedTypes';
import { bufferedWordDuration, roundToMs } from '../sharedUtils';

const convertTranscriptToCuts = (transcript: Transcription): Array<Cut> => {
  const wordsNotYetUpdated = transcript.words.filter((word) => !word.deleted);
  if (wordsNotYetUpdated.length === 0) {
    return [];
  }

  const { words } = updateOutputTimes(wordsNotYetUpdated);

  let currentStartWord = words[0];
  let currentDuration = bufferedWordDuration(currentStartWord);

  const cuts: Cut[] = words.reduce<Cut[]>((cutsSoFar, word, i) => {
    // First we deal with the edge case of the last word -
    // in this case we always have to add the cut

    const isFinalWord = i === words.length - 1;

    if (isFinalWord) {
      // Add the final cut
      return cutsSoFar.concat({
        startTime:
          currentStartWord.startTime - currentStartWord.bufferDurationBefore,
        duration: roundToMs(currentDuration),
        outputStartTime: currentStartWord.outputStartTime,
        index: cutsSoFar.length,
      });
    }

    // If we make it to here, we're dealing with a word other than the last one, so we
    // know that the next word will be defined.
    const nextWord = words[i + 1];

    // If the next word lines up with the current one, i.e. they are in
    // sequential order, then there's no point splitting into multiple cuts;
    // we can just merge the words into a single cut.
    // Hence we just add the next word's total (buffered) duration to the running
    // duration total for this cut.
    if (word.originalIndex + 1 === nextWord.originalIndex) {
      currentDuration += bufferedWordDuration(nextWord);

      return cutsSoFar;
    }
    // If there's a gap in words, or they're out of order, then we have to make a new cut.
    // Hence, add the current cut to our list of cuts and move the current start word to be
    // the next word we're looking at, which begins the next cut.

    const newCut = {
      startTime:
        currentStartWord.startTime - currentStartWord.bufferDurationBefore,
      duration: roundToMs(currentDuration),
      outputStartTime: currentStartWord.outputStartTime,
      index: cutsSoFar.length,
    };

    currentStartWord = nextWord;
    currentDuration = bufferedWordDuration(nextWord);

    // Append the cut we just made to the cuts we already have, and return it
    return cutsSoFar.concat(newCut);
  }, []);

  return cuts;
};

export default convertTranscriptToCuts;
