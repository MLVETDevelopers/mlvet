import { Word, IndexRange } from '../../sharedTypes';
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

const detectPotentialSimilarTakes = (
  potentialTakeLen: number,
  potentialTakeGroupStartIdxs: number[],
  sentences: Sentence[]
): { isSimilarTake: boolean; updatedCurrentSentenceIdx: number } => {
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
    const nextSentenceIdxToCompare = potentialTakeGroupStartIdxs[0] + i;

    // compare sentence in first potential take chunk with every other potential take chunk
    // compare the next sentence each time
    for (let j = 1; j < potentialTakeGroupStartIdxs.length; j += 1) {
      const nextSimilarity = getSimilarityScore(
        sentences[nextSentenceIdxToCompare].sentenceString,
        sentences[potentialTakeGroupStartIdxs[j] + i].sentenceString
      );

      // if sentence in the chunk is not similar, discard all chunks to the right
      if (nextSimilarity < THRESHOLD) {
        const potentialTakeGroupStartIdxsLen =
          potentialTakeGroupStartIdxs.length;
        const chunksToDiscard =
          potentialTakeGroupStartIdxsLen - potentialTakeGroupStartIdxs[j];
        const chunksLeft = potentialTakeGroupStartIdxsLen - chunksToDiscard;

        // if only the first chunk left, reset
        if (chunksLeft === 1) {
          // if potential take greater then two, re-start from the first sentence in the second chunk
          if (potentialTakeGroupStartIdxsLen > 2) {
            updatedCurrentSentenceIdx = potentialTakeGroupStartIdxs[j] + i - 1;
          } else {
            // else start from the failed sentence
            updatedCurrentSentenceIdx = potentialTakeGroupStartIdxs[j] + i;
          }

          isSimilarTake = false;
          break;
        }

        // discard chunks to the right
        for (let k = 0; k < chunksToDiscard; k += 1) {
          potentialTakeGroupStartIdxs.pop();
        }
      }
    }
  }

  if (isSimilarTake)
    updatedCurrentSentenceIdx =
      potentialTakeLen * potentialTakeGroupStartIdxs.length;

  return { isSimilarTake, updatedCurrentSentenceIdx };
};

const updatetakeGroups = (
  potentialTakeGroupStartIdxs: number[],
  potentialTakeLen: number,
  takeGroups: InjectableTakeGroup[],
  sentences: Sentence[]
) => {
  // if all the sentence in potential take are similar, add them to takeGroups
  potentialTakeGroupStartIdxs.forEach((startIdx) => {
    const newGroup: InjectableTakeGroup = { takes: [] };

    for (let m = 0; m < potentialTakeLen; m += 1) {
      const currentSentence = sentences[startIdx + m];
      const takeRange: IndexRange = {
        startIndex: currentSentence.startIndex as number,
        endIndex: currentSentence.endIndex as number,
      };
      const take: InjectableTake = { wordRange: takeRange };

      newGroup.takes.push(take);
    }

    takeGroups.push(newGroup);
  });
};

const startDetection: (
  potentialTakeLen: number,
  potentialTakeGroupStartIdxs: number[],
  sentences: Sentence[],
  takeGroups: InjectableTakeGroup[]
) => number = (
  potentialTakeLen,
  potentialTakeGroupStartIdxs,
  sentences,
  takeGroups
) => {
  // check similarity between sentences in each take chunk
  const { isSimilarTake, updatedCurrentSentenceIdx } =
    detectPotentialSimilarTakes(
      potentialTakeLen,
      potentialTakeGroupStartIdxs,
      sentences
    );

  if (isSimilarTake)
    updatetakeGroups(
      potentialTakeGroupStartIdxs,
      potentialTakeLen,
      takeGroups,
      sentences
    );

  return updatedCurrentSentenceIdx;
};

export function findTakes(words: Word[]): InjectableTakeGroup[] {
  const sentences: Sentence[] = findSentences(words);
  const takeGroups: InjectableTakeGroup[] = [];

  let currentSentenceIdx = 0;
  let detectNotCompelet = true;
  const maxSentenceIdx = sentences.length - 1;

  while (detectNotCompelet) {
    let potentialTakeLen = 0;
    const potentialTakeGroupStartIdxs: number[] = [];

    // set first sentence as potential take
    potentialTakeGroupStartIdxs.push(currentSentenceIdx);

    let nextSentenceIdx = currentSentenceIdx + 1;
    const maxRemainingTakesIdx = Math.round(
      (sentences.length - currentSentenceIdx) / 2
    );

    // search for any similar sentence start from current first sentence
    while (nextSentenceIdx <= maxRemainingTakesIdx || potentialTakeLen > 0) {
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
        ) > THRESHOLD;

      // if already found potentail take
      // but next sentence at potential take index is not similar
      if (potentialTakeLen > 0 && !isSimilar) break;

      if (isSimilar) {
        if (potentialTakeLen === 0) {
          potentialTakeLen = nextSentenceIdx - currentSentenceIdx;
        }

        potentialTakeGroupStartIdxs.push(nextSentenceIdx);
        nextSentenceIdx += potentialTakeLen;
      } else {
        nextSentenceIdx += 1;
      }
    }

    if (potentialTakeGroupStartIdxs.length > 1) {
      if (potentialTakeLen > 1) {
        // start detection after find all potential take start index
        const updatedCurrentSentenceIdx = startDetection(
          potentialTakeLen,
          potentialTakeGroupStartIdxs,
          sentences,
          takeGroups
        );

        currentSentenceIdx = updatedCurrentSentenceIdx;
      } else {
        updatetakeGroups(
          potentialTakeGroupStartIdxs,
          potentialTakeLen,
          takeGroups,
          sentences
        );
        currentSentenceIdx =
          potentialTakeLen * potentialTakeGroupStartIdxs.length;
      }
    } else {
      currentSentenceIdx += 1;
    }

    if (
      potentialTakeGroupStartIdxs[potentialTakeGroupStartIdxs.length - 1] +
        potentialTakeLen ===
      sentences.length
    ) {
      detectNotCompelet = false;
    }
  }

  return takeGroups;
}

export default { getSimilarityScore };
