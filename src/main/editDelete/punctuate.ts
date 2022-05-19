import { MapCallback } from '../util';
import { Word } from '../../sharedTypes';

type PartialWord = Pick<Word, 'word' | 'startTime' | 'duration'>;
type Thresholds = { lowerCommaThreshold: number; upperCommaThreshold: number };

// // TODO: use silence averaging to implement punctuation
// const lowerCommaThreshold = 0.1;
// const upperCommaThreshold = 0.17;

const capitalizeFirstLetter: (string: string) => string = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const calculateThresholds: (averageSilenceDuration: number) => Thresholds = (
  averageSilenceDuration
) => {
  return {
    lowerCommaThreshold: averageSilenceDuration * 0.85, // determined constants through trial and error
    upperCommaThreshold: averageSilenceDuration * 1.8,
  };
};

const punctuate: (
  totalDuration: number,
  averageSilenceDuration: number
) => MapCallback<PartialWord, PartialWord> =
  (totalDuration, averageSilenceDuration) => (word, index, words) => {
    const isLastWord = index === words.length - 1;
    const endTime = isLastWord ? totalDuration : words[index + 1].startTime;
    const silenceDuration = endTime - word.startTime - word.duration;

    if (index === 0) {
      words[index].word = capitalizeFirstLetter(words[index].word);
    }

    const thresholds: Thresholds = calculateThresholds(averageSilenceDuration);

    let punctuation: string;
    if (silenceDuration < thresholds.lowerCommaThreshold) {
      punctuation = '';
    } else if (silenceDuration < thresholds.upperCommaThreshold) {
      punctuation = ',';
    } else {
      punctuation = '.';
      if (!isLastWord) {
        words[index + 1].word = capitalizeFirstLetter(words[index + 1].word);
      }
    }

    // capitalise 'I' and 'I'm'
    if (word.word === 'i' || word.word === "i'm") {
      word.word = capitalizeFirstLetter(word.word);
    }

    const punctuatedWord: string = word.word + punctuation;

    return {
      ...word,
      word: punctuatedWord,
    };
  };

export default punctuate;
