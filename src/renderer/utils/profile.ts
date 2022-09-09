let TOTAL_WORDS = 0;
let TOTAL_TIME = 0;

const profileWords: (label: string, type: string, time: number) => void = (
  _,
  _2,
  timeTaken
) => {
  TOTAL_WORDS += 1;
  TOTAL_TIME += timeTaken;

  // console.log(TOTAL_TIME, TOTAL_WORDS);
};

export default profileWords;
