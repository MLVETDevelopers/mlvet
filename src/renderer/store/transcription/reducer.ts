import { Reducer } from 'redux';
import { mapInRanges, rangeLengthOne } from 'renderer/util';
import { updateOutputStartTimes } from 'transcriptProcessing/updateOutputStartTimes';
import {
  TRANSCRIPTION_CREATED,
  DELETE_SELECTION,
  PASTE_WORD,
  UNDO_DELETE_SELECTION,
  UNDO_PASTE_WORD,
  CORRECT_WORD,
  UNDO_CORRECT_WORD,
} from './actions';
import { Transcription, Word } from '../../../sharedTypes';
import { Action } from '../action';
import {
  CorrectWordPayload,
  DeleteSelectionPayload,
  PasteWordsPayload,
  UndoCorrectWordPayload,
  UndoDeleteSelectionPayload,
  UndoPasteWordsPayload,
} from '../undoStack/opPayloads';

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

  if (action.type === CORRECT_WORD) {
    const { index, text } = action.payload as CorrectWordPayload;

    return {
      ...transcription,
      words: mapInRanges(
        transcription.words,
        (word) => ({ ...word, word: text }),
        [rangeLengthOne(index)]
      ), // no need to run updateOutputStartTimes as durations not changed
    };
  }

  if (action.type === UNDO_CORRECT_WORD) {
    const { index, prevText } = action.payload as UndoCorrectWordPayload;

    return {
      ...transcription,
      words: mapInRanges(
        transcription.words,
        (word) => ({ ...word, word: prevText }),
        [rangeLengthOne(index)]
      ), // no need to run updateOutputStartTimes as durations not changed
    };
  }

  return transcription;
};

export default transcriptionReducer;
