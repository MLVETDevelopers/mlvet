import { Op } from 'renderer/store/undoStack/helpers';
import { Word } from 'sharedTypes';
import {
  wordPasted,
  undoWordPasted,
} from 'renderer/store/transcriptionWords/actions';
import {
  selectionCleared,
  selectionRangeSetTo,
} from 'renderer/store/selection/actions';
import { PasteWordsPayload, UndoPasteWordsPayload } from '../opPayloads';

export type PasteWordsOp = Op<PasteWordsPayload, UndoPasteWordsPayload>;

export const makePasteWord: (
  pasteTo: number,
  clipboard: Word[]
) => PasteWordsOp = (pasteTo, clipboard) => {
  return {
    do: [
      wordPasted(pasteTo, clipboard),
      selectionRangeSetTo({
        startIndex: pasteTo + 1,
        endIndex: pasteTo + clipboard.length + 1,
      }),
    ],
    undo: [undoWordPasted(pasteTo, clipboard.length), selectionCleared()],
  };
};
