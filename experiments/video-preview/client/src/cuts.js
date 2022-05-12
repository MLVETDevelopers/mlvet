export const cuts = [
  {
    start: 459.2,
    end: 459.5,
  },
  {
    start: 459.2,
    end: 459.5,
  },
  {
    start: 459.2,
    end: 459.5,
  },
  {
    start: 459.2,
    end: 459.5,
  },
  {
    start: 459.2,
    end: 459.5,
  },
  {
    start: 459.2,
    end: 459.5,
  },
  {
    start: 459.2,
    end: 459.5,
  },
  {
    start: 459.2,
    end: 459.5,
  },
  {
    start: 459.2,
    end: 459.54,
  },
  {
    start: 459.2,
    end: 459.54,
  },
  {
    start: 459.2,
    end: 459.58,
  },
  {
    start: 459.2,
    end: 459.58,
  },
  {
    start: 459.2,
    end: 459.62,
  },
  {
    start: 8.5,
    end: 9.84,
  },
  {
    start: 14.8,
    end: 14.9,
  },
  {
    start: 9.84,
    end: 12.6,
  },
  {
    start: 7.4,
    end: 7.45,
  },
  {
    start: 2.31,
    end: 3.41,
  },
  {
    start: 8.5,
    end: 22.1,
  },
];

// export const cuts = [
// 	{
// 		start: 8.5,
// 		end: 9.52,
// 	},
// 	{
// 		start: 5206.0,
// 		end: 5206.5,
// 	},
// 	{
// 		start: 9.52,
// 		end: 13.6,
// 	},
// 	{
// 		start: 5206.1,
// 		end: 5206.35,
// 	},
// 	{
// 		start: 2.31,
// 		end: 3.32,
// 	},
// ];

export const convertTranscriptToCuts = (transcript) => {
  const { words } = transcript.transcripts[0];

  const theCuts = [];
  const currentCut = { start: words[0].start_time, end: undefined };

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i].start_time + words[i].duration !== words[i + 1].start_time) {
      currentCut.end = words[i].start_time + words[i].duration;
      theCuts.push({ ...currentCut });
      currentCut.start = words[i + 1].start_time;
    }
  }

  const lastWord = words[words.length - 1];
  currentCut.end = lastWord.start_time + lastWord.duration;
  theCuts.push({ ...currentCut });

  return theCuts;
};
