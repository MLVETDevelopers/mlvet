import { Op } from 'renderer/store/undoStack/helpers';
import { IndexRange, Word } from 'sharedTypes';
import {
  wordPasted,
  undoWordPasted,
  selectionDeleted,
  undoSelectionDeleted,
} from 'renderer/store/transcriptionWords/actions';
import { selectionRangeSetTo } from 'renderer/store/selection/actions';
import { getLengthOfRange } from 'renderer/utils/range';
import { PasteWordsPayload, UndoPasteWordsPayload } from '../opPayloads';

export type PasteWordsOp = Op<PasteWordsPayload, UndoPasteWordsPayload>;

export const makePasteWord: (
  range: IndexRange,
  clipboard: Word[]
) => PasteWordsOp = (range, clipboard) => {
  const { endIndex } = range;

  return getLengthOfRange(range) > 1
    ? {
        do: [
          selectionDeleted(range),
          wordPasted(range, clipboard),
          selectionRangeSetTo({
            startIndex: endIndex,
            endIndex: endIndex + clipboard.length,
          }),
        ],
        undo: [
          undoWordPasted(range, clipboard.length),
          undoSelectionDeleted(range),
          selectionRangeSetTo(range),
        ],
      }
    : {
        do: [
          wordPasted(range, clipboard),
          selectionRangeSetTo({
            startIndex: endIndex,
            endIndex: endIndex + clipboard.length,
          }),
        ],
        undo: [
          undoWordPasted(range, clipboard.length),
          undoSelectionDeleted(range),
          selectionRangeSetTo(range),
        ],
      };
};
