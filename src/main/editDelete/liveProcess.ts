import { Transcription, Word } from 'sharedTypes';

// const calculateStartTime = (
//     transcript: Transcription,
// ): Transcription => {

//     transcript.words[0].outputStartTime = 0
//     for (let i = 1; i < transcript.words.length; i ++){
//         transcript.words[i].outputStartTime = transcript.words[i-1].outputStartTime + transcript.words[i-1].duration
//     }

// }

const calculate = (word: Word, i: number, words: Word[]): Word => {
  if (i === 0) {
    word.outputStartTime = 0;
  } else {
    word.outputStartTime = words[i - 1].outputStartTime + words[i - 1].duration;
  }
  return word;
};

const liveProcess = (transcript: Transcription): Transcription => {
  transcript.words.map(calculate);
  return transcript;
};

export default liveProcess;
