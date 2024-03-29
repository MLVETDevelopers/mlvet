import {
  CollabClientInitialState,
  CollabClientSessionState,
} from 'renderer/store/collab/helpers';
import { emptyRange } from 'renderer/utils/range';
import {
  RuntimeProject,
  RecentProject,
  Word,
  CtrlFindSelectionState,
  SelectionState,
} from '../../sharedTypes';
import { ApplicationPage } from './currentPage/helpers';
import { DownloadModel } from './downloadModel/helpers';
import { ExportIo } from './exportIo/helpers';
import { OpQueueItem } from './opQueue/helpers';
import { UndoStack } from './undoStack/helpers';
import { PlaybackState } from './playback/helpers';
import { MenuCustomModals } from './menuCustomModals/helpers';

export type EditWordState = { index: number; text: string } | null;

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
  selection: SelectionState;
  ctrlFSelection: CtrlFindSelectionState;
  shortcutsOpened: boolean;
  menuCustomModals: MenuCustomModals;
  // Index of word currently being edited, otherwise null
  editWord: EditWordState;
  // whether confidence underlines are currently visible
  isShowingConfidenceUnderlines: boolean;
  // whether ctrl-f popover is currently visible
  isShowingCtrlFPopover: boolean;
  // Collab session state
  collab: CollabClientSessionState | CollabClientInitialState | null;
  // Op queue session state for pending actions when in a collab session
  opQueue: OpQueueItem[];
  downloadModel: DownloadModel;
  playback: PlaybackState;
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
  selection: {
    self: emptyRange(),
    others: {},
  },
  ctrlFSelection: {
    selectedIndex: 0,
    maxIndex: 0,
    indexRanges: [],
  },
  shortcutsOpened: false,
  menuCustomModals: {
    isUpdateTranscriptionAPIKeyOpened: false,
    isUpdateTranscriptionChoiceOpened: false,
  },
  editWord: null,
  isShowingConfidenceUnderlines: false,
  isShowingCtrlFPopover: false,
  collab: null,
  opQueue: [],
  downloadModel: {
    isDownloading: false,
    isDownloadComplete: false,
    downloadProgress: 0,
    lastUpdated: null,
    timeRemaining: null,
    previousDownloadProgress: 0,
  },
  playback: {
    rangeOverride: null,
    rangeType: null,
  },
};
