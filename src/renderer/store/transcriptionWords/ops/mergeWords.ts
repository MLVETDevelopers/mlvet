import { rangeLengthOne } from 'renderer/utils/range';
import {
  wordsMerged,
  undoWordsMerged,
} from 'renderer/store/transcriptionWords/actions';
import { IndexRange, Word } from '../../../../sharedTypes';
import { selectionRangeSetTo } from '../../selection/actions';
import { Op } from '../../undoStack/helpers';
import { MergeWordsPayload, UndoMergeWordsPayload } from '../opPayloads';

export type MergeWordsOp = Op<MergeWordsPayload, UndoMergeWordsPayload>;

/**
 * Merges a contiguous range of words into a single word, absorbing any buffers between
 * into the duration
 * @param words - current words in the transcription
 * @param range - range of words to merge into a single word
 * @returns op containing do and undo for a merge operation
 */
export const makeMergeWords: (
  words: Word[],
  range: IndexRange
) => MergeWordsOp = (words, range) => {
  const originalWords = words.slice(range.startIndex, range.endIndex);

  return {
    do: [
      wordsMerged(range),
      selectionRangeSetTo(rangeLengthOne(range.startIndex)),
    ],
    undo: [
      undoWordsMerged(range.startIndex, originalWords),
      selectionRangeSetTo(range),
    ],
  };
};
