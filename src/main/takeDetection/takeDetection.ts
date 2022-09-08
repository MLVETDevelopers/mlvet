import { Word, IndexRange } from 'sharedTypes';
import {
  InjectableTake,
  InjectableTakeGroup,
} from 'main/editDelete/injectTakeInfo';
import getSimilarityScore from './sentenceSimilarity';
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

function newTakeGroup(
  sentenceOne: Sentence,
  sentenceTwo: Sentence
): InjectableTakeGroup {
  const newGroup: InjectableTakeGroup = { takes: [] };
  let nextTakeRange: IndexRange = {
    startIndex: sentenceOne.startIndex as number,
    endIndex: sentenceOne.endIndex as number,
  };
  let nextTake: InjectableTake = { wordRange: nextTakeRange };
  newGroup.takes.push(nextTake);
  nextTakeRange = {
    startIndex: sentenceTwo.startIndex as number,
    endIndex: sentenceTwo.endIndex as number,
  };
  nextTake = { wordRange: nextTakeRange };
  newGroup.takes.push(nextTake);
  return newGroup;
}

export function findTakes(words: Word[], threshold = THRESHOLD): InjectableTakeGroup[] {
  const takeGroups: InjectableTakeGroup[] = [];
  const sentences: Sentence[] = findSentences(words);
  for (let i = 0; i < sentences.length - 1; i += 1) {
    const similarity: number = getSimilarityScore(
      sentences[i].sentenceString,
      sentences[i + 1].sentenceString
    );
    if (similarity > threshold) {
      if (takeGroups.length !== 0) {
        const lastTake: IndexRange = takeGroups.at(-1)?.takes.at(-1)
          ?.wordRange as IndexRange;
        if (
          lastTake.startIndex === sentences[i].startIndex &&
          lastTake.endIndex === sentences[i].endIndex
        ) {
          const nextTakeRange: IndexRange = {
            startIndex: sentences[i + 1].startIndex as number,
            endIndex: sentences[i + 1].endIndex as number,
          };
          const nextTake: InjectableTake = { wordRange: nextTakeRange };
          takeGroups.at(-1)?.takes.push(nextTake);
        } else {
          takeGroups.push(newTakeGroup(sentences[i], sentences[i + 1]));
        }
      } else {
        takeGroups.push(newTakeGroup(sentences[i], sentences[i + 1]));
      }
    }
  }
  return takeGroups;
}

export default { getSimilarityScore };
