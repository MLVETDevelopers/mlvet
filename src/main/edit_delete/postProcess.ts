import Clip from './Clip';

/**
 * Removes deleted words from edited trancription
 * @param wordList
 */
const removeDeleted = (wordList: Array<any>): void => {
  let i = 0;
  while (i < wordList.length) {
    if (wordList[i].deleted) {
      wordList.splice(i, 1);
    } else {
      i += 1;
    }
  }
};

/**
 * Processes edited data to be ready for export
 * @param wordList
 * @returns
 */
const FILENAME = 'placeholder_filename.mp4';

const postProcess = (wordList: Array<any>): Array<Clip> => {
  removeDeleted(wordList);
  const res: Array<Clip> = [];
  let currentStartTime = -1;
  let currentDuration = 0;

  for (let i = 0; i < wordList.length - 1; i += 1) {
    if (currentStartTime === -1) {
      currentStartTime = wordList[i].start_time;
      currentDuration = wordList[i].duration;
    }

    if (
      wordList[i].start_time + wordList[i].duration ===
      wordList[i + 1].start_time
    ) {
      currentDuration += wordList[i + 1].duration;
    } else {
      res.push(new Clip(currentStartTime, currentDuration, FILENAME));
      currentStartTime = -1;
      currentDuration = 0;
    }
  }

  if (res.length === 0) {
    currentStartTime = wordList[0].start_time;
    res.push(new Clip(currentStartTime, currentDuration, FILENAME));
  } else if (currentStartTime === -1) {
    currentStartTime = wordList[wordList.length - 1].start_time;
    currentDuration = wordList[wordList.length - 1].duration;
    res.push(new Clip(currentStartTime, currentDuration, FILENAME));
  } else {
    res.push(new Clip(currentStartTime, currentDuration, FILENAME));
  }

  return res;
};

export default postProcess;
