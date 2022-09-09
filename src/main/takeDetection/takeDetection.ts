import { Word } from '../../sharedTypes';
import {
  InjectableTake,
  InjectableTakeGroup,
} from '../editDelete/injectTakeInfo';
import { getSimilarityScore } from './sentenceSimilarity';
import { THRESHOLD } from './constants';

export type Sentence = {
  startIndex: number | null;
  endIndex: number | null;
  sentenceString: string;
};

export function findSentences(words: Word[]): Sentence[] {
  let currentSentence: Sentence = {
    startIndex: 0,
    endIndex: null,
    sentenceString: '',
  };
  const sentences: Sentence[] = [];
  words.forEach((word, idx) => {
    if (currentSentence.sentenceString === '') {
      currentSentence.sentenceString = word.word;
    } else {
      currentSentence.sentenceString = currentSentence.sentenceString.concat(
        ' ',
        word.word.toString()
      );
    }

    if (
      word.word.includes('.') ||
      word.word.includes('?') ||
      word.word.includes('!') ||
      idx === words.length - 1
    ) {
      currentSentence.endIndex = idx + 1;
      sentences.push(currentSentence);
      currentSentence = {
        startIndex: idx + 1,
        endIndex: null,
        sentenceString: '',
      };
    }
  });
  sentences[sentences.length - 1].endIndex = words.length;
  return sentences;
}

const newTakeGroup = (
  potentialTakeStartIdxs: number[],
  potentialTakeLen: number,
  sentences: Sentence[]
): InjectableTakeGroup => {
  // if all the sentence in potential take are similar, add them to takeGroups
  const takes = potentialTakeStartIdxs.map((startIdx) => {
    const takeStartSentence = sentences[startIdx];
    const takeEndSentence = sentences[startIdx + potentialTakeLen - 1];

    return {
      wordRange: {
        startIndex: takeStartSentence.startIndex as number,
        endIndex: takeEndSentence.endIndex as number,
      },
    } as InjectableTake;
  });

  return { takes };
};

const startDetection: (
  potentialTakeLen: number,
  potentialTakeStartIdxs: number[],
  sentences: Sentence[],
  takeGroups: InjectableTakeGroup[],
  threshold: number
) => number = (
  potentialTakeLen,
  potentialTakeStartIdxs,
  sentences,
  takeGroups,
  threshold
) => {
  // not constructive, and potential take before this sentence is valid
  // assume sentences in potential take are similar
  let isSimilarTake = true;
  let updatedCurrentSentenceIdx = 0;

  // compare sentences within the potential take length, start from the second sentence
  for (let i = 1; i < potentialTakeLen; i += 1) {
    // if sentence is not similar, discard potential take and restart
    if (!isSimilarTake) {
      break;
    }

    // compute the next sentence's index in the first take group
    // as reference to compare the rest
    const nextSentenceIdxToCompare = potentialTakeStartIdxs[0] + i;

    // compare sentence in first potential take chunk with every other potential take chunk
    // compare the next sentence each time
    for (let j = 1; j < potentialTakeStartIdxs.length; j += 1) {
      const nextSimilarity = getSimilarityScore(
        sentences[nextSentenceIdxToCompare].sentenceString,
        sentences[potentialTakeStartIdxs[j] + i].sentenceString
      );

      // if sentence in the chunk is not similar, discard all chunks to the right
      if (nextSimilarity < threshold) {
        const potentialTakeStartIdxsLen = potentialTakeStartIdxs.length;
        const chunksToDiscard =
          potentialTakeStartIdxsLen - potentialTakeStartIdxs[j];
        const chunksLeft = potentialTakeStartIdxsLen - chunksToDiscard;

        // if only the first chunk left, reset
        if (chunksLeft === 1) {
          // if potential take greater then two, re-start from the first sentence in the second chunk
          if (potentialTakeStartIdxsLen > 2) {
            updatedCurrentSentenceIdx = potentialTakeStartIdxs[j] + i - 1;
          } else {
            // else start from the failed sentence
            updatedCurrentSentenceIdx = potentialTakeStartIdxs[j] + i;
          }

          isSimilarTake = false;
          break;
        }

        // discard chunks to the right
        for (let k = 0; k < chunksToDiscard; k += 1) {
          potentialTakeStartIdxs.pop();
        }
      }
    }
  }

  if (isSimilarTake) {
    updatedCurrentSentenceIdx =
      potentialTakeLen * potentialTakeStartIdxs.length;

    takeGroups.push(
      newTakeGroup(potentialTakeStartIdxs, potentialTakeLen, sentences)
    );
  }

  return updatedCurrentSentenceIdx;
};

export function findTakes(
  words: Word[],
  threshold = THRESHOLD
): InjectableTakeGroup[] {
  const sentences: Sentence[] = findSentences(words);
  const takeGroups: InjectableTakeGroup[] = [];

  let currentSentenceIdx = 0;
  let detectNotComplete = true;
  const maxSentenceIdx = sentences.length - 1;

  while (detectNotComplete) {
    let potentialTakeLen = 0;
    const potentialTakeStartIdxs: number[] = [];

    // set first sentence as potential take
    potentialTakeStartIdxs.push(currentSentenceIdx);

    let nextSentenceIdx = currentSentenceIdx + 1;
    const maxRemainingTakesIdx =
      Math.round((sentences.length - currentSentenceIdx) / 2) +
      currentSentenceIdx;

    // search for any similar sentence start from current first sentence
    while (nextSentenceIdx < maxRemainingTakesIdx || potentialTakeLen > 0) {
      // if remaining sentences can't make valid take
      if (
        nextSentenceIdx > maxSentenceIdx ||
        nextSentenceIdx + potentialTakeLen - 1 > maxSentenceIdx
      )
        break;

      const isSimilar =
        getSimilarityScore(
          sentences[currentSentenceIdx].sentenceString,
          sentences[nextSentenceIdx].sentenceString
        ) > threshold;

      // if already found potential take
      // but next sentence at potential take index is not similar
      if (potentialTakeLen > 0 && !isSimilar) break;

      if (isSimilar) {
        if (potentialTakeLen === 0) {
          potentialTakeLen = nextSentenceIdx - currentSentenceIdx;
        }

        potentialTakeStartIdxs.push(nextSentenceIdx);
        nextSentenceIdx += potentialTakeLen;
      } else {
        nextSentenceIdx += 1;
      }
    }

    if (potentialTakeStartIdxs.length > 1) {
      if (potentialTakeLen > 1) {
        // start detection after find all potential take start index
        const updatedCurrentSentenceIdx = startDetection(
          potentialTakeLen,
          potentialTakeStartIdxs,
          sentences,
          takeGroups,
          threshold
        );

        currentSentenceIdx = updatedCurrentSentenceIdx;
      } else {
        takeGroups.push(
          newTakeGroup(potentialTakeStartIdxs, potentialTakeLen, sentences)
        );
        currentSentenceIdx = potentialTakeLen * potentialTakeStartIdxs.length;
      }
    } else {
      currentSentenceIdx += 1;
    }

    if (
      potentialTakeStartIdxs[potentialTakeStartIdxs.length - 1] +
        potentialTakeLen ===
      sentences.length
    ) {
      detectNotComplete = false;
    }
  }

  return takeGroups;
}

export default { getSimilarityScore };
