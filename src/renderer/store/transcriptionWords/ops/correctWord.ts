import { Op } from 'renderer/store/undoStack/helpers';
import { Word } from 'sharedTypes';
import { rangeLengthOne } from 'renderer/utils/range';
import { CorrectWordPayload, UndoCorrectWordPayload } from '../opPayloads';
import { wordCorrected, undoWordCorrected } from '../actions';
import { selectionRangeSetTo } from '../../selection/actions';

export type CorrectWordOp = Op<CorrectWordPayload, UndoCorrectWordPayload>;

export const makeCorrectWord: (
  words: Word[],
  index: number,
  newText: string
) => CorrectWordOp = (words, index, newText) => {
  const { word: prevText, confidence: prevConfidence } = words[index];

  return {
    do: [
      wordCorrected(index, newText),
      selectionRangeSetTo(rangeLengthOne(index)),
    ],
    undo: [
      undoWordCorrected(index, prevText as string, prevConfidence ?? 1),
      selectionRangeSetTo(rangeLengthOne(index)),
    ],
  };
};
