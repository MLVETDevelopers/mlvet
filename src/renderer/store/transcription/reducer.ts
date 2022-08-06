import { Reducer } from 'redux';
import { mapInRanges, rangesToIndices } from 'renderer/util';
import { updateOutputStartTimes } from 'transcriptProcessing/updateOutputStartTimes';
import { TRANSCRIPTION_CREATED } from './actions';
import { Transcription, Word } from '../../../sharedTypes';
import { Action } from '../action';
import {
  DeleteSelectionPayload,
  MoveWordsPayload,
  PasteWordsPayload,
  UndoDeleteSelectionPayload,
  UndoMoveWordsPayload,
  UndoPasteWordsPayload,
} from '../undoStack/opPayloads';
import {
  DELETE_SELECTION,
  MOVE_WORDS,
  PASTE_WORD,
  UNDO_DELETE_SELECTION,
  UNDO_MOVE_WORDS,
  UNDO_PASTE_WORD,
} from '../undoStack/ops';

/**
 *  Nested reducer for handling transcriptions
 */
const transcriptionReducer: Reducer<Transcription | null, Action<any>> = (
  transcription = null,
  action
) => {
  if (action.type === TRANSCRIPTION_CREATED) {
    return action.payload as Transcription;
  }

  // Everything below here assumes we have a transcription, so early exit if we don't
  if (transcription === null) {
    return null;
  }

  /**
   * Important: if you make an update to the transcription here, usually you
   * will need to call 'updateOutputStartTimes' so that output start times are kept accurate!
   */

  if (action.type === DELETE_SELECTION) {
    const { ranges } = action.payload as DeleteSelectionPayload;

    const markDeleted = (word: Word) => ({ ...word, deleted: true });

    const newWords = mapInRanges(transcription.words, markDeleted, ranges);

    return {
      ...transcription,
      words: updateOutputStartTimes(newWords),
    };
  }

  if (action.type === UNDO_DELETE_SELECTION) {
    const { ranges } = action.payload as UndoDeleteSelectionPayload;

    const markUndeleted = (word: Word) => ({ ...word, deleted: false });

    return {
      ...transcription,
      words: updateOutputStartTimes(
        mapInRanges(transcription.words, markUndeleted, ranges)
      ),
    };
  }

  if (action.type === PASTE_WORD) {
    const { startIndex, clipboard } = action.payload as PasteWordsPayload;

    const prefix = transcription.words.slice(0, startIndex + 1);

    // Paste key must be unique for all pasted words - that is, no two pasted words should ever have the same paste key.
    // We force this invariant by finding the highest paste key in the entire transcription to this point, and then
    // adding n to it for the nth pasted word, for all words on the clipboard.
    const highestExistingPasteKey = Math.max(
      0,
      ...transcription.words.map((word) => word.pasteKey)
    );
    const wordsToPaste = clipboard.map((word, index) => ({
      ...word,
      pasteKey: highestExistingPasteKey + index + 1,
    }));

    const suffix = transcription.words.slice(startIndex + 1);

    return {
      ...transcription,
      words: updateOutputStartTimes([...prefix, ...wordsToPaste, ...suffix]),
    };
  }

  if (action.type === UNDO_PASTE_WORD) {
    const { startIndex, clipboardLength } =
      action.payload as UndoPasteWordsPayload;

    const prefix = transcription.words.slice(0, startIndex + 1);
    const suffix = transcription.words.slice(startIndex + clipboardLength + 1);

    return {
      ...transcription,
      words: updateOutputStartTimes([...prefix, ...suffix]),
    };
  }

  if (action.type === MOVE_WORDS) {
    const { fromRanges, toAfterIndex } = action.payload as MoveWordsPayload;

    // TODO(chloe) handle words that are copies (i.e. resulting from a paste) being moved -
    // their previous locations should be explicitly deleted instead of just marked as deleted.
    // (i.e. the actual words should be moved).
    // May need to add extra information to the UNDO_MOVE_WORDS payload to support this

    // List of words that are being moved.
    // TODO(chloe) ensure deleted words are not selectable in the first place, as
    // this can mess with undo-moves (which assumes they should not be deleted)
    const movedWords = fromRanges.flatMap((range) =>
      transcription.words.slice(range.startIndex, range.endIndex)
    );

    // Use the same paste-key logic as pasting - as moved words just mark their originals as deleted, they need unique paste keys
    const highestExistingPasteKey = Math.max(
      0,
      ...transcription.words.map((word) => word.pasteKey)
    );

    const movedWordsWithNewPasteKeys = movedWords.map((word, index) => ({
      ...word,
      pasteKey: highestExistingPasteKey + index + 1,
    }));

    // List of indices that were moved, which need to be removed
    const affectedIndices = rangesToIndices(fromRanges);

    // Mark words that were moved as deleted
    const remainingWords = transcription.words.map((word, i) => ({
      ...word,
      deleted: affectedIndices.has(i),
    }));

    // List of words up to the point where the moved words are being placed
    const prefix = remainingWords.slice(0, toAfterIndex + 1);

    // List of words after the point where the moved words are being placed
    const suffix = remainingWords.slice(toAfterIndex + movedWords.length);

    return {
      ...transcription,
      words: updateOutputStartTimes([
        ...prefix,
        ...movedWordsWithNewPasteKeys,
        ...suffix,
      ]),
    };
  }

  if (action.type === UNDO_MOVE_WORDS) {
    const { fromRanges, toAfterIndex } = action.payload as UndoMoveWordsPayload;

    // List of indices that were moved, which need to be restored - these indices are for before the moved words were there
    const affectedIndices = rangesToIndices(fromRanges);

    const prefix = transcription.words.slice(0, toAfterIndex + 1);

    const suffix = transcription.words.slice(
      toAfterIndex + affectedIndices.size + 1
    );

    const previousWords = [...prefix, ...suffix].map((word) => ({
      ...word,
      deleted: false,
    }));

    return {
      ...transcription,
      words: updateOutputStartTimes(previousWords),
    };
  }

  return transcription;
};

export default transcriptionReducer;
