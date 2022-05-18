import { Cut } from 'sharedTypes';

const cuts: Cut[] = [
  {
    startTime: 3.2,
    duration: 3.2, // 0
  },
  {
    startTime: 1.2,
    duration: 3.3, // 3.2
  },
  {
    startTime: 8.2,
    duration: 0.3, // 6.5
  },
  {
    startTime: 5.5,
    duration: 0.9, // 6.8
  },
  {
    startTime: 9.6,
    duration: 1.2, // 7.7
  },
  {
    startTime: 8.2,
    duration: 0.6, // 8.9
  },
  {
    startTime: 7.8,
    duration: 4.8, // 9.5
  },
  // {
  //   startTime: 1,
  //   duration: 4.8, // 14.3 (KEEPS BEING 14.45)
  // },
];

// Total Length = 19.1 (KEEPS BEING 19.27)

export default cuts;
