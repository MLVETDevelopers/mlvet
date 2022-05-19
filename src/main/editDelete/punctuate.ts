import { MapCallback } from '../util';
import { Word } from '../../sharedTypes';

type PartialWord = Pick<Word, 'word' | 'startTime' | 'duration'>;

const lowerCommaThreshold = 0.1;
const upperCommaThreshold = 0.17;
const upperFullStopThreshold = 0.25;

const punctuate: (
  totalDuration: number
) => MapCallback<PartialWord, PartialWord> =
  (totalDuration) => (word, index, words) => {
    const isLastWord = index === words.length - 1;
    const endTime = isLastWord ? totalDuration : words[index + 1].startTime;
    const silenceDuration = endTime - word.startTime - word.duration;

    let punctuation: string;
    if (silenceDuration < lowerCommaThreshold) {
      punctuation = '';
    } else if (silenceDuration < upperCommaThreshold) {
      punctuation = ',';
    } else if (silenceDuration < upperFullStopThreshold) {
      punctuation = '.';
    } else {
      punctuation = '\n';
    }
    const punctuatedWord: string = word.word + punctuation;

    return {
      ...word,
      word: punctuatedWord,
    };
  };

export default punctuate;
