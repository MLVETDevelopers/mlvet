import { Op } from 'renderer/store/undoStack/helpers';
import { Word } from 'sharedTypes';
import { rangeLengthOne } from 'renderer/utils/range';
import { CorrectWordPayload, UndoCorrectWordPayload } from '../opPayloads';
import { wordCorrected, undoWordCorrected } from '../actions';
import { selectionCleared, selectionRangeAdded } from '../../selection/actions';

export type CorrectWordOp = Op<CorrectWordPayload, UndoCorrectWordPayload>;

export const makeCorrectWord: (
  words: Word[],
  index: number,
  newText: string
) => CorrectWordOp = (words, index, newText) => {
  const prevText = words[index].word;

  return {
    do: [
      wordCorrected(index, newText),
      selectionCleared(),
      selectionRangeAdded(rangeLengthOne(index)),
    ],
    undo: [
      undoWordCorrected(index, prevText),
      selectionCleared(),
      selectionRangeAdded(rangeLengthOne(index)),
    ],
  };
};
