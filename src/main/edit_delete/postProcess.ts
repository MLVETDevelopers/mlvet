import { Transcription } from 'sharedTypes';
import Clip from './Clip';

/**
 * Processes edited data to be ready for export
 * @param wordList
 * @returns
 */
const FILENAME = 'placeholder_filename.mp4';

const postProcess = (jsonTranscript: Transcription): Array<Clip> => {

  const wordList = jsonTranscript.words.filter(word => !word.deleted)
  
  const res: Array<Clip> = [];
  let currentStartTime = -1;
  let currentDuration = 0;

  for (let i = 0; i < wordList.length - 1; i += 1) {
    if (currentStartTime === -1) {
      currentStartTime = wordList[i].startTime;
      currentDuration = wordList[i].duration;
    }

    if (
      wordList[i].startTime + wordList[i].duration ===
      wordList[i + 1].startTime
    ) {
      currentDuration += wordList[i + 1].duration;
    } else {
      res.push(new Clip(currentStartTime, currentDuration, FILENAME));
      currentStartTime = -1;
      currentDuration = 0;
    }
  }

  if (res.length === 0) {
    currentStartTime = wordList[0].startTime;
    res.push(new Clip(currentStartTime, currentDuration, FILENAME));
  } else if (currentStartTime === -1) {
    currentStartTime = wordList[wordList.length - 1].startTime;
    currentDuration = wordList[wordList.length - 1].duration;
    res.push(new Clip(currentStartTime, currentDuration, FILENAME));
  } else {
    res.push(new Clip(currentStartTime, currentDuration, FILENAME));
  }

  return res;
};

export default postProcess;
