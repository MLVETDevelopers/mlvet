import { IndexRange, Word } from 'sharedTypes';
import {
  InjectableTakeGroup,
  InjectableTake,
} from '../editDelete/mockTakeInfo';

type Sentence = {
  startIndex: number | null;
  endIndex: number | null;
  sentenceString: string;
};

function findSentences(words: Word[]): Sentence[] {
  let currentSentence: Sentence = {
    startIndex: 0,
    endIndex: null,
    sentenceString: '',
  };
  const sentences: Sentence[] = [];
  words.forEach((word, idx) => {
    currentSentence.sentenceString = currentSentence.sentenceString.concat(
      ' ',
      word.word.toString()
    );
    if (
      word.word.includes('.') ||
      word.word.includes('?') ||
      word.word.includes('!')
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
  sentences[sentences.length - 1].endIndex = words.length - 1;
  return sentences;
}

function getSimilarityScore(sentenceOne: string, sentenceTwo: string): number {
  sentenceOne.concat(sentenceTwo);
  return 0.5;
}

function findTakes(words: Word[]): InjectableTakeGroup[] {
  // const updatedWords = [...words];
  const takeGroups: InjectableTakeGroup[] = [];
  // let nextTakeGroupNo: number = 1;
  const sentences: Sentence[] = findSentences(words);
  for (let i = 0; i < sentences.length; i += 1) {
    const similarity: number = getSimilarityScore(
      sentences[i].sentenceString,
      sentences[i + 1].sentenceString
    );
    const threshold = 0.6;
    if (similarity > threshold) {
      if (takeGroups.length !== 0) {
        const lastTake: IndexRange = takeGroups.at(-1)?.takes.at(-1)
          ?.wordRange as IndexRange;
        if (
          lastTake.startIndex === sentences[i].startIndex &&
          lastTake.endIndex === sentences[i].endIndex
        ) {
          const nextTake: IndexRange = {
            startIndex: sentences[i + 1].startIndex as number,
            endIndex: sentences[i + 1].endIndex as number,
          };
          takeGroups.at(-1).takes.push(nextTake);
        }
      } else {
        const newGroup: InjectableTakeGroup = { takes: [] };
        let nextTakeRange: IndexRange = {
          startIndex: sentences[i].startIndex as number,
          endIndex: sentences[i].endIndex as number,
        };
        let nextTake: InjectableTake = { wordRange: nextTakeRange };
        newGroup.takes.push(nextTake);
        nextTakeRange = {
          startIndex: sentences[i + 1].startIndex as number,
          endIndex: sentences[i + 1].endIndex as number,
        };
        nextTake = { wordRange: nextTakeRange };
        newGroup.takes.push(nextTake);
      }
    }
  }
  return takeGroups;
}
