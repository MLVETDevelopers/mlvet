import { Transcription, Word } from '../../../sharedTypes';
import { Action } from '../helpers';
import {
  UndoDeleteEverySecondWordPayload,
  ChangeWordToSwampPayload,
  UndoChangeWordToSwampPayload,
} from '../opPayloads';
import {
  CHANGE_WORD_TO_SWAMP,
  DELETE_EVERY_SECOND_WORD,
  UNDO_CHANGE_WORD_TO_SWAMP,
  UNDO_DELETE_EVERY_SECOND_WORD,
} from '../ops';

/**
 *  Nested reducer for handling transcriptions
 */
const transcriptionReducer: (
  transcription: Transcription,
  action: Action<any>
) => Transcription = (transcription, action) => {
  if (action.type === DELETE_EVERY_SECOND_WORD) {
    return {
      ...transcription,
      words: transcription.words.filter((_, i) => i % 2 === 0),
    };
  }

  if (action.type === UNDO_DELETE_EVERY_SECOND_WORD) {
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

  if (action.type === CHANGE_WORD_TO_SWAMP) {
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

  if (action.type === UNDO_CHANGE_WORD_TO_SWAMP) {
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
