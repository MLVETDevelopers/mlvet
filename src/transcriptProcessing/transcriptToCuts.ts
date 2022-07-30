import { updateOutputStartTimes } from './updateOutputStartTimes';
import { Transcription, Cut } from '../sharedTypes';
import { bufferedWordDuration, roundToMs } from '../sharedUtils';

const convertTranscriptToCuts = (transcript: Transcription): Array<Cut> => {
  const words = updateOutputStartTimes(
    transcript.words.filter((word) => !word.deleted)
  );

  let currentStartWord = words[0];
  let currentDuration = bufferedWordDuration(currentStartWord);

  const cuts: Array<Cut> = [];

  // Add all cuts except the final one
  words.forEach((word, i) => {
    const isFinalWord = i === words.length - 1;

    if (isFinalWord) {
      // Add the final cut
      cuts.push({
        startTime:
          currentStartWord.startTime - currentStartWord.bufferDurationBefore,
        duration: roundToMs(currentDuration),
        outputStartTime: currentStartWord.outputStartTime,
        index: cuts.length,
      });

      return;
    }

    const nextWord = words[i + 1];

    if (word.originalIndex + 1 === nextWord.originalIndex) {
      currentDuration += bufferedWordDuration(nextWord);
    } else {
      cuts.push({
        startTime:
          currentStartWord.startTime - currentStartWord.bufferDurationBefore,
        duration: roundToMs(currentDuration),
        outputStartTime: currentStartWord.outputStartTime,
        index: cuts.length,
      });

      currentStartWord = nextWord;
      currentDuration = bufferedWordDuration(nextWord);
    }
  });

  return cuts;
};

export default convertTranscriptToCuts;
