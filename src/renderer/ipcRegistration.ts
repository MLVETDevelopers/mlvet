import ipc from './ipc';
import { copyText, cutText, deleteText, pasteText } from './editor/clipboard';
import { selectAllWords } from './editor/selection';
import saveProject from './file/saveProject';
import saveAsProject from './file/saveAsProject';
import onProjectOpen from './file/onProjectOpen';
import exportProgressUpdate from './file/exportProgressUpdate';
import onExportFinish from './file/onExportFinish';
import exportProject from './file/exportProject';
import returnToHome from './navigation/returnToHome';
import { performUndo, performRedo } from './editor/undoRedo';
import { mergeWords, splitWord } from './editor/mergeSplit';

const IPC_RECEIVERS: Record<string, (...args: any[]) => void> = {
  // File actions
  'initiate-save-project': saveProject,
  'initiate-save-as-project': saveAsProject,
  'project-opened': onProjectOpen,
  'export-progress-update': exportProgressUpdate,
  'export-finish': onExportFinish,
  'initiate-export-project': exportProject,

  // Editor actions
  'initiate-cut-text': cutText,
  'initiate-copy-text': copyText,
  'initiate-paste-text': pasteText,
  'initiate-delete-text': deleteText,
  'initiate-select-all': selectAllWords,
  'initiate-merge-words': mergeWords,
  'initiate-split-word': splitWord,
  'initiate-undo': performUndo,
  'initiate-redo': performRedo,

  // Navigation actions
  'initiate-return-to-home': returnToHome,
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
