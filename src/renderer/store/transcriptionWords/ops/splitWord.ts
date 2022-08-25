import { rangeLengthOne } from 'renderer/utils/range';
import {
  wordSplit,
  undoWordSplit,
} from 'renderer/store/transcriptionWords/actions';
import { Word } from '../../../../sharedTypes';
import { selectionCleared, selectionRangeAdded } from '../../selection/actions';
import { Op } from '../../undoStack/helpers';
import { SplitWordPayload, UndoSplitWordPayload } from '../opPayloads';

export type SplitWordOp = Op<SplitWordPayload, UndoSplitWordPayload>;

/**
 * Splits a word that contains multiple words in its text, creating new words with evenly split durations.
 * @param words - current words in the transcription
 * @param index - index of word to split into multiple words
 * @returns op containing do and undo for a merge operation
 */
export const makeSplitWord: (words: Word[], index: number) => SplitWordOp = (
  words,
  index
) => {
  const word = words[index];

  // Number of words that the word will be split into
  const wordCount = word.word.split(' ').length;

  const range = {
    startIndex: index,
    endIndex: index + wordCount,
  };

  return {
    do: [wordSplit(index), selectionCleared(), selectionRangeAdded(range)],
    undo: [
      undoWordSplit(range),
      selectionCleared(),
      selectionRangeAdded(rangeLengthOne(index)),
    ],
  };
};
