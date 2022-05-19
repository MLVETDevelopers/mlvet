import { MapCallback } from '../util';
import { Word } from '../../sharedTypes';

type PartialWord = Pick<Word, 'word' | 'startTime' | 'duration'>;

// TODO: use silence averaging to implement punctuation
const lowerCommaThreshold = 0.1;
const upperCommaThreshold = 0.17;
const upperFullStopThreshold = 0.25;

const capitalizeFirstLetter: (string: string) => string = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const punctuate: (
  totalDuration: number
) => MapCallback<PartialWord, PartialWord> =
  (totalDuration) => (word, index, words) => {
    const isLastWord = index === words.length - 1;
    const endTime = isLastWord ? totalDuration : words[index + 1].startTime;
    const silenceDuration = endTime - word.startTime - word.duration;

    if (index === 0) {
      words[index].word = capitalizeFirstLetter(words[index].word);
    }

    let punctuation: string;
    if (silenceDuration < lowerCommaThreshold) {
      punctuation = '';
    } else if (silenceDuration < upperCommaThreshold) {
      punctuation = ',';
    } else if (silenceDuration < upperFullStopThreshold) {
      punctuation = '.';
      if (!isLastWord) {
        words[index + 1].word = capitalizeFirstLetter(words[index + 1].word);
      }
    } else {
      punctuation = '.\n';
      if (!isLastWord) {
        words[index + 1].word = capitalizeFirstLetter(words[index + 1].word);
      }
    }

    const punctuatedWord: string = word.word + punctuation;

    return {
      ...word,
      word: punctuatedWord,
    };
  };

export default punctuate;
