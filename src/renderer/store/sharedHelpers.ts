import { CollabClientSessionState } from 'renderer/collabClient/types';
import { RuntimeProject, RecentProject, Word } from '../../sharedTypes';
import { ApplicationPage } from './currentPage/helpers';
import { ExportIo } from './exportIo/helpers';
import { UndoStack } from './undoStack/helpers';

/**
 * The schema for the root-level application / redux store, containing the global app state.
 */
export interface ApplicationStore {
  currentProject: RuntimeProject | null;
  recentProjects: RecentProject[];
  currentPage: ApplicationPage;
  undoStack: UndoStack;
  exportIo: ExportIo;
  clipboard: Word[];
  // Array of numbers corresponding to indices of words within the transcription
  selection: number[];
  shortcutsOpened: boolean;
  isUpdateTranscriptionAPIKeyOpened: boolean;
  // Index of word currently being edited, otherwise null
  editWord: { index: number; text: string } | null;
  // whether confidence underlines are currently visible
  isShowingConfidenceUnderlines: boolean;
  // Collab session state
  collab: CollabClientSessionState | null;
}

/**
 * The initial state of the application store / redux store.
 * This is what the store looks like every time the application starts.
 */
export const initialStore: ApplicationStore = {
  currentProject: null,
  recentProjects: [],
  currentPage: ApplicationPage.HOME,
  undoStack: { stack: [], index: 0 },
  exportIo: { isExporting: false, exportProgress: 0 },
  clipboard: [],
  selection: [],
  shortcutsOpened: false,
  isUpdateTranscriptionAPIKeyOpened: false,
  editWord: null,
  isShowingConfidenceUnderlines: false,
  collab: null,
};
