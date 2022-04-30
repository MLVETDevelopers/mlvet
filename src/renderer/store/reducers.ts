import { combineReducers } from 'redux';
import {
  PROJECT_CREATED,
  CURRENT_PROJECT_CLOSED,
  RECENT_PROJECT_ADDED,
  TRANSCRIPTION_CREATED,
  PROJECT_OPENED,
  PAGE_CHANGED,
  UNDO_STACK_PUSHED,
  UNDO_STACK_POPPED,
  OP_REDONE,
} from './actions';
import {
  ApplicationStore,
  ApplicationPage,
  initialStore,
  Action,
  Op,
} from './helpers';
import { Project, Transcription, Word } from '../../sharedTypes';
import {
  ChangeWordToSwampPayload,
  DoPayload,
  UndoChangeWordToSwampPayload,
  UndoDeleteEverySecondWordPayload,
  UndoPayload,
} from './opPayloads';
import {
  CHANGE_WORD_TO_SWAMP,
  DELETE_EVERY_SECOND_WORD,
  UNDO_CHANGE_WORD_TO_SWAMP,
  UNDO_DELETE_EVERY_SECOND_WORD,
} from './ops';

const currentProjectReducer: (
  currentProject: ApplicationStore['currentProject'],
  action: Action<any>
) => ApplicationStore['currentProject'] = (
  currentProject = initialStore.currentProject,
  action
) => {
  if (action.type === PROJECT_CREATED || action.type === PROJECT_OPENED) {
    return action.payload as Project;
  }

  if (action.type === CURRENT_PROJECT_CLOSED) {
    return null;
  }

  if (action.type === TRANSCRIPTION_CREATED && currentProject !== null) {
    return {
      ...currentProject,
      transcription: action.payload as Transcription,
    };
  }

  if (
    action.type === DELETE_EVERY_SECOND_WORD &&
    currentProject !== null &&
    currentProject.transcription !== null
  ) {
    return {
      ...currentProject,
      transcription: {
        ...currentProject.transcription,
        words: currentProject.transcription.words.filter((_, i) => i % 2 === 0),
      },
    };
  }

  if (
    action.type === UNDO_DELETE_EVERY_SECOND_WORD &&
    currentProject !== null &&
    currentProject.transcription !== null
  ) {
    const { deletedWords } = action.payload as UndoDeleteEverySecondWordPayload;

    const newWordList: Word[] = [];

    currentProject.transcription.words.forEach((word, i) => {
      newWordList.push(word);
      if (i < deletedWords.length) {
        newWordList.push(deletedWords[i]);
      }
    });

    return {
      ...currentProject,
      transcription: {
        ...currentProject.transcription,
        words: newWordList,
      },
    };
  }

  if (
    action.type === CHANGE_WORD_TO_SWAMP &&
    currentProject !== null &&
    currentProject.transcription !== null
  ) {
    return {
      ...currentProject,
      transcription: {
        ...currentProject.transcription,
        words: currentProject.transcription.words.map((v, i) => ({
          ...v,
          word:
            i === (action.payload as ChangeWordToSwampPayload).index
              ? 'SWAMP'
              : v.word,
        })),
      },
    };
  }

  if (
    action.type === UNDO_CHANGE_WORD_TO_SWAMP &&
    currentProject !== null &&
    currentProject.transcription !== null
  ) {
    const { index, changedWord } =
      action.payload as UndoChangeWordToSwampPayload;

    return {
      ...currentProject,
      transcription: {
        ...currentProject.transcription,
        words: currentProject.transcription.words.map((v, i) =>
          i === index ? changedWord : v
        ),
      },
    };
  }

  return currentProject;
};

const recentProjectsReducer: (
  recentProjects: ApplicationStore['recentProjects'],
  action: Action<any>
) => ApplicationStore['recentProjects'] = (
  recentProjects = initialStore.recentProjects,
  action
) => {
  if (action.type === RECENT_PROJECT_ADDED) {
    return [action.payload as Project, ...recentProjects];
  }

  return recentProjects;
};

const currentPageReducer: (
  currentPage: ApplicationStore['currentPage'],
  action: Action<any>
) => ApplicationStore['currentPage'] = (
  currentPage = initialStore.currentPage,
  action
) => {
  if (action.type === PAGE_CHANGED) {
    return action.payload as ApplicationPage;
  }

  return currentPage;
};

const undoStackReducer: (
  undoStack: ApplicationStore['undoStack'],
  action: Action<any>
) => ApplicationStore['undoStack'] = (
  undoStack = initialStore.undoStack,
  action
) => {
  if (
    action.type === PROJECT_OPENED ||
    action.type === CURRENT_PROJECT_CLOSED
  ) {
    return initialStore.undoStack;
  }

  if (action.type === UNDO_STACK_PUSHED) {
    const { stack, index } = undoStack;

    const newStack = stack
      .slice(0, index)
      .concat([action.payload as Op<DoPayload, UndoPayload>]);

    return {
      stack: newStack,
      index: newStack.length,
    };
  }

  if (action.type === UNDO_STACK_POPPED) {
    const { stack, index } = undoStack;

    return {
      stack,
      index: index - 1,
    };
  }

  if (action.type === OP_REDONE) {
    const { stack, index } = undoStack;

    return {
      stack,
      index: index + 1,
    };
  }

  return undoStack;
};

const rootReducer = combineReducers({
  currentProject: currentProjectReducer,
  recentProjects: recentProjectsReducer,
  currentPage: currentPageReducer,
  undoStack: undoStackReducer,
});

export default rootReducer;
