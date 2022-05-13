import { Reducer } from 'redux';
import { TRANSCRIPTION_CREATED } from '../actions';
import { Transcription, Word } from '../../../sharedTypes';
import { Action } from '../helpers';
import {
  UndoDeleteEverySecondWordPayload,
  ChangeWordToSwampPayload,
  UndoChangeWordToSwampPayload,
  DeleteWordsPayload,
} from '../opPayloads';
import {
  CHANGE_WORD_TO_SWAMP,
  DELETE_EVERY_SECOND_WORD,
  UNDO_CHANGE_WORD_TO_SWAMP,
  UNDO_DELETE_EVERY_SECOND_WORD,
  DELETE_WORD,
  UNDO_DELETE_WORD,
} from '../ops';

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

  if (action.type === DELETE_EVERY_SECOND_WORD && transcription !== null) {
    return {
      ...transcription,
      words: transcription.words.filter((_, i) => i % 2 === 0),
    };
  }

  if (action.type === UNDO_DELETE_EVERY_SECOND_WORD && transcription !== null) {
    const { deletedWords } = action.payload as UndoDeleteEverySecondWordPayload;

    const newWordList: Word[] = [];

    // Reconstruct original word list given deleted words
    transcription.words.forEach((word, i) => {
      newWordList.push(word);
      if (i < deletedWords.length) {
        newWordList.push(deletedWords[i]);
      }
    });

    return {
      ...transcription,
      words: newWordList,
    };
  }

  if (action.type === CHANGE_WORD_TO_SWAMP && transcription !== null) {
    return {
      ...transcription,
      words: transcription.words.map((v, i) => ({
        ...v,
        word:
          i === (action.payload as ChangeWordToSwampPayload).index
            ? 'SWAMP'
            : v.word,
      })),
    };
  }

  if (
    (action.type === DELETE_WORD || action.type === UNDO_DELETE_WORD) &&
    transcription != null
  ) {
    const { startIndex, endIndex } = action.payload as DeleteWordsPayload;

    // sets newDeleted bool to true for delete and false for undo
    const newDeletedBool = action.type === DELETE_WORD;

    return {
      ...transcription,
      words: transcription.words.map((word, i) => ({
        ...word,
        deleted:
          i >= startIndex && i <= endIndex ? newDeletedBool : word.deleted,
      })),
    };
  }

  if (action.type === UNDO_CHANGE_WORD_TO_SWAMP && transcription !== null) {
    const { index, changedWord } =
      action.payload as UndoChangeWordToSwampPayload;

    return {
      ...transcription,
      words: transcription.words.map((v, i) => (i === index ? changedWord : v)),
    };
  }

  return transcription;
};

export default transcriptionReducer;
