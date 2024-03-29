import ipc from './ipc';
import { selectAllWords, selectSentence } from './editor/selection';
import saveProject from './file/saveProject';
import saveAsProject from './file/saveAsProject';
import onProjectOpen from './file/onProjectOpen';
import exportProgressUpdate from './file/exportProgressUpdate';
import onExportFinish from './file/onExportFinish';
import exportProject from './file/exportProject';
import returnToHome from './navigation/returnToHome';
import { performUndo, performRedo } from './editor/undoRedo';
import { mergeWords, splitWord } from './editor/mergeSplit';
import openShortcuts from './navigation/openShortcuts';
import openUpdateTranscriptionAPIKey from './navigation/openUpdateTranscriptionAPIKey';
import toggleConfidenceUnderlines from './editor/toggleConfidenceUnderlines';
import editWord from './editor/editWord';
import onExportStart from './file/onExportStart';
import toggleCtrlFPopover from './editor/toggleCtrlFPopover';
import updateDownloadModelState from './file/downloadModelProgressUpdate';
import openUpdateTranscriptionChoice from './navigation/openUpdateTranscriptionChoice';
import registerClipboardHandlers from './clipboardRegistration';
import { deleteText } from './editor/clipboard';

const IPC_RECEIVERS: Record<string, (...args: any[]) => void> = {
  // File actions
  'initiate-save-project': saveProject,
  'initiate-save-as-project': saveAsProject,
  'project-opened': onProjectOpen,
  'export-progress-update': exportProgressUpdate,
  'export-finish': onExportFinish,
  'export-start': onExportStart,
  'initiate-export-project': exportProject,
  'open-update-transcription-api-key': openUpdateTranscriptionAPIKey,
  'open-update-transcription-choice': openUpdateTranscriptionChoice,
  'update-download-model-state': updateDownloadModelState,

  // Editor actions
  // 'initiate-cut-text': cutText,
  // 'initiate-copy-text': copyText,
  // 'initiate-paste-text': pasteText,
  'initiate-delete-text': deleteText,
  'initiate-select-all': selectAllWords,
  'initiate-select-sentence': selectSentence,
  'initiate-edit-word': editWord,
  'initiate-merge-words': mergeWords,
  'initiate-split-word': splitWord,
  'initiate-undo': performUndo,
  'initiate-redo': performRedo,
  'toggle-confidence-underlines': toggleConfidenceUnderlines,
  'toggle-ctrl-f-popover': toggleCtrlFPopover,

  // Navigation actions
  'initiate-return-to-home': returnToHome,
  'open-shortcuts': openShortcuts,
};

/**
 * Register an IPC handler for a particular event key, ignoring the
 * 'event' object
 *
 * @param key
 * @param handler
 */
const registerIpcHandler: (
  key: string,
  handler: (...args: any[]) => void
) => void = (key, handler) => {
  ipc.on(key, async (_event, ...args: any[]) => {
    handler(...args);
  });
};

// Register the editor actions as IPC receivers
Object.keys(IPC_RECEIVERS).forEach((key) =>
  registerIpcHandler(key, IPC_RECEIVERS[key])
);

// Also register clipboard handlers
registerClipboardHandlers();
