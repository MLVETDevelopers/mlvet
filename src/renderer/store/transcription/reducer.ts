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
  UndoPasteWordsPayload,
} from '../undoStack/opPayloads';
import {
  DELETE_SELECTION,
  MOVE_WORDS,
  PASTE_WORD,
  UNDO_DELETE_SELECTION,
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

    // List of indices that were moved, which need to be removed
    const affectedIndices = rangesToIndices(fromRanges);

    // List of words that are being moved
    const movedWords = fromRanges.flatMap((range) =>
      transcription.words.slice(range.startIndex, range.endIndex)
    );

    // All words in the transcription excluding the ones that were moved.
    // Rather than explicitly filtering which affects the indexes, just add a marker for now
    const remainingWords = transcription.words.map((word, i) => ({
      ...word,
      shouldRemove: affectedIndices.has(i),
    }));

    // List of words up to the point where the moved words are being placed,
    // now explicitly filtering out the moved words
    const prefix = remainingWords
      .slice(0, toAfterIndex + 1)
      .filter((word) => !word.shouldRemove);

    // List of words after the point where the moved words are being placed,
    // now explicitly filtering out the moved words
    const suffix = remainingWords
      .slice(toAfterIndex + movedWords.length + 1)
      .filter((word) => !word.shouldRemove);

    return {
      ...transcription,
      words: updateOutputStartTimes(
        [...prefix, ...movedWords, ...suffix].map((word) => ({
          ...word,
          shouldRemove: undefined, // remove this as it isn't a standard attribute on Word objects
        }))
      ),
    };
  }

  // TODO: UNDO_MOVE_WORDS action

  return transcription;
};

export default transcriptionReducer;
