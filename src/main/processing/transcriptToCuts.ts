import { Transcription, Cut } from '../../sharedTypes';

const convertTranscriptToCuts = (transcript: Transcription): Array<Cut> => {
  const cuts: Array<Cut> = [];

  const words = transcript.words.filter((word) => !word.deleted);
  let cut: Cut;
  let currentStartWord = words[0];
  let currentDuration = words[0].duration;

  for (let i = 0; i < words.length - 1; i += 1) {
    const word = words[i];
    const nextWord = words[i + 1];

    if (
      (word.startTime + word.duration).toFixed(4) !==
      nextWord.startTime.toFixed(4)
    ) {
      cut = {
        startTime: currentStartWord.startTime,
        duration: currentDuration,
        outputStartTime: currentStartWord.outputStartTime,
        index: cuts.length,
      };
      cuts.push(cut);
      currentStartWord = words[i + 1];
      currentDuration = words[i + 1].duration;
    } else if (nextWord.duration > 0) {
      currentDuration += nextWord.duration;
    }
  }

  cuts.push({
    startTime: currentStartWord.startTime,
    duration: currentDuration,
    outputStartTime: currentStartWord.outputStartTime,
    index: cuts.length,
  });

  return cuts;
};

export default convertTranscriptToCuts;
