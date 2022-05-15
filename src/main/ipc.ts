import { ipcMain } from 'electron';

import { IpcContext } from './types';

// Everything between the START GENERATED CODE and END GENERATED CODE comments will be replaced with the injected handler invocations when 'yarn gen' is run

// START GENERATED CODE PART 1
import extractAudio from './handlers/audioExtract';
import getFileNameWithExtension from './handlers/getFileNameWithExtension';
import handleOpenProject from './handlers/openProjectHandler';
import handleOsQuery from './handlers/osQuery';
import retrieveProjectMetadata from './handlers/projectMetadataHandler';
import readRecentProjects from './handlers/readRecentProjects';
import requestMediaDialog from './handlers/requestMediaDialog';
import handleSaveAsProject from './handlers/saveAsProjectHandler';
import saveProject from './handlers/saveProjectHandler';
import setSaveEnabled from './handlers/setSaveEnabled';
import setUndoRedoEnabled from './handlers/setUndoRedoEnabled';
import extractThumbnail from './handlers/thumbnailExtract';
import requestTranscription from './handlers/transcriptionHandler';
import writeRecentProjects from './handlers/writeRecentProjects';
// END GENERATED CODE PART 1

const initialiseIpcHandlers: (ipcContext: IpcContext) => void = (
  ipcContext
) => {
  // START GENERATED CODE PART 2
  ipcMain.handle('extract-audio', async (_event, project) =>
    extractAudio(project)
  );

  ipcMain.handle('get-file-name-with-extension', async (_event, filePath) =>
    getFileNameWithExtension(filePath)
  );

  ipcMain.handle('handle-open-project', async (_event, filePath) =>
    handleOpenProject(ipcContext, filePath)
  );

  ipcMain.handle('handle-os-query', async () => handleOsQuery());

  ipcMain.handle('retrieve-project-metadata', async (_event, project) =>
    retrieveProjectMetadata(project)
  );

  ipcMain.handle('read-recent-projects', async () => readRecentProjects());

  ipcMain.handle('request-media-dialog', async () =>
    requestMediaDialog(ipcContext)
  );

  ipcMain.handle('handle-save-as-project', async (_event, project) =>
    handleSaveAsProject(ipcContext, project)
  );

  ipcMain.handle('save-project', async (_event, project) =>
    saveProject(ipcContext, project)
  );

  ipcMain.handle(
    'set-save-enabled',
    async (_event, saveEnabled, saveAsEnabled) =>
      setSaveEnabled(ipcContext, saveEnabled, saveAsEnabled)
  );

  ipcMain.handle(
    'set-undo-redo-enabled',
    async (_event, undoEnabled, redoEnabled) =>
      setUndoRedoEnabled(ipcContext, undoEnabled, redoEnabled)
  );

  ipcMain.handle('extract-thumbnail', async (_event, absolutePathToMediaFile) =>
    extractThumbnail(absolutePathToMediaFile)
  );

  ipcMain.handle('request-transcription', async (_event, project) =>
    requestTranscription(project)
  );

  ipcMain.handle('write-recent-projects', async (_event, recentProjects) =>
    writeRecentProjects(recentProjects)
  );
  // END GENERATED CODE PART 2
};

export default initialiseIpcHandlers;
