const preProcess = (wordList: Array<any>, duration: number): Array<any> => {
  for (let i = 0; i < wordList.length - 1; i += 1) {
    wordList[i].duration = wordList[i + 1].start_time - wordList[i].start_time;
    wordList[i].deleted = false;
  }
  wordList[wordList.length - 1].duration =
    duration - wordList[wordList.length - 1].start_time;
  wordList[wordList.length - 1].deleted = false;

  return wordList;
};
