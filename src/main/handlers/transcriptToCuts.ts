import { Transcription, Cut } from '../../sharedTypes';

const convertTranscriptToCuts = (transcript: Transcription): Array<Cut> => {
  const cuts: Array<Cut> = [];

  const words = transcript.words.filter((word) => !word.deleted);
  let cut: Cut;
  let currentStartTime = -1;
  let currentDuration = 0;

  for (let i = 0; i < words.length - 1; i += 1) {
    const word = words[i];
    const nextWord = words[i + 1];

    if (currentStartTime === -1) {
      currentStartTime = word.startTime;
      currentDuration = word.duration;
    }

    if (word.startTime + word.duration !== nextWord.startTime) {
      cut = {
        startTime: currentStartTime,
        duration: currentDuration,
      };
      cuts.push(cut);

      currentStartTime = -1;
      currentDuration = 0;
    } else {
      currentDuration += nextWord.duration;
    }
  }

  const lastWord = words[words.length - 1];
  if (currentStartTime === -1) {
    cut = {
      startTime: lastWord.startTime,
      duration: lastWord.duration,
    };
  } else {
    cut = {
      startTime: currentStartTime,
      duration: currentDuration,
    };
  }
  cuts.push(cut);

  return cuts;
};

export default convertTranscriptToCuts;
