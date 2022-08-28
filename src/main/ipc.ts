/* eslint-disable prettier/prettier */
import { ipcMain } from 'electron';

import { IpcContext } from './types';

// Everything between the START GENERATED CODE and END GENERATED CODE comments will be replaced with the injected handler invocations when 'yarn gen' is run

// START GENERATED CODE PART 1
import deleteProject from './handlers/file/deleteProject';
import openProject from './handlers/file/openProjectHandler';
import retrieveProjectMetadata from './handlers/file/projectMetadataHandler';
import readRecentProjects from './handlers/file/readRecentProjects';
import requestMediaDialog from './handlers/file/requestMediaDialog';
import saveAsProject from './handlers/file/saveAsProjectHandler';
import saveChangesDialog from './handlers/file/saveChangesDialog';
import saveProject from './handlers/file/saveProjectHandler';
import writeRecentProjects from './handlers/file/writeRecentProjects';
import extractAudio from './handlers/media/audioExtract';
import exportProject from './handlers/media/exportProjectHandler';
import extractThumbnail from './handlers/media/thumbnailExtract';
import loadThumbnail from './handlers/media/thumbnailLoad';
import transcribe from './handlers/media/transcribe';
import requestTranscription from './handlers/media/transcriptionHandler';
import setConfidenceLinesEnabled from './handlers/menu/setConfidenceLinesEnabled';
import setExportEnabled from './handlers/menu/setExportEnabled';
import setFileRepresentation from './handlers/menu/setFileRepresentation';
import setHomeEnabled from './handlers/menu/setHomeEnabled';
import setMergeSplitEnabled from './handlers/menu/setMergeSplitEnabled';
import setSaveEnabled from './handlers/menu/setSaveEnabled';
import setUndoRedoEnabled from './handlers/menu/setUndoRedoEnabled';
import getFileNameWithExtension from './handlers/misc/getFileNameWithExtension';
import handleOsQuery from './handlers/misc/osQuery';
import setClipboardEnabled from './handlers/setClipboardEnabled';
import closeWindow from './handlers/window/closeWindow';
import promptSave from './handlers/window/promptSave';
import returnToHome from './handlers/window/returnToHomeHandler';
import showConfirmation from './handlers/window/showConfirmation';
// END GENERATED CODE PART 1

const initialiseIpcHandlers: (ipcContext: IpcContext) => void = (
  ipcContext
) => {
  // START GENERATED CODE PART 2
  ipcMain.handle('delete-project', async (_event, project) =>
    deleteProject(project)
  );

  ipcMain.handle('open-project', async (_event, filePath) =>
    openProject(ipcContext, filePath)
  );

  ipcMain.handle('retrieve-project-metadata', async (_event, project) =>
    retrieveProjectMetadata(project)
  );

  ipcMain.handle('read-recent-projects', async () => readRecentProjects());

  ipcMain.handle('request-media-dialog', async () =>
    requestMediaDialog(ipcContext)
  );

  ipcMain.handle('save-as-project', async (_event, project) =>
    saveAsProject(ipcContext, project)
  );

  ipcMain.handle(
    'save-changes-dialog',
    async (_event, mainWindow, projectFileName) =>
      saveChangesDialog(mainWindow, projectFileName)
  );

  ipcMain.handle('save-project', async (_event, project) =>
    saveProject(ipcContext, project)
  );

  ipcMain.handle('write-recent-projects', async (_event, recentProjects) =>
    writeRecentProjects(recentProjects)
  );

  ipcMain.handle('extract-audio', async (_event, project) =>
    extractAudio(project)
  );

  ipcMain.handle('export-project', async (_event, project) =>
    exportProject(ipcContext, project)
  );

  ipcMain.handle(
    'extract-thumbnail',
    async (_event, absolutePathToMediaFile, project) =>
      extractThumbnail(absolutePathToMediaFile, project)
  );

  ipcMain.handle('load-thumbnail', async (_event, projectId) =>
    loadThumbnail(projectId)
  );

  ipcMain.handle('transcribe', async (_event, project, transcriptionEngine) =>
    transcribe(project, transcriptionEngine)
  );

  ipcMain.handle('request-transcription', async (_event, project) =>
    requestTranscription(project)
  );

  ipcMain.handle(
    'set-confidence-lines-enabled',
    async (_event, menuItemEnabled) =>
      setConfidenceLinesEnabled(ipcContext, menuItemEnabled)
  );

  ipcMain.handle('set-export-enabled', async (_event, exportEnabled) =>
    setExportEnabled(ipcContext, exportEnabled)
  );

  ipcMain.handle(
    'set-file-representation',
    async (_event, representedFilePath, isEdited) =>
      setFileRepresentation(ipcContext, representedFilePath, isEdited)
  );

  ipcMain.handle('set-home-enabled', async (_event, homeEnabled) =>
    setHomeEnabled(ipcContext, homeEnabled)
  );

  ipcMain.handle(
    'set-merge-split-enabled',
    async (_event, mergeEnabled, splitEnabled) =>
      setMergeSplitEnabled(ipcContext, mergeEnabled, splitEnabled)
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

  ipcMain.handle('get-file-name-with-extension', async (_event, filePath) =>
    getFileNameWithExtension(filePath)
  );

  ipcMain.handle('handle-os-query', async () => handleOsQuery());

  ipcMain.handle(
    'set-clipboard-enabled',
    async (_event, cutEnabled, copyEnabled, pasteEnabled, deleteEnabled) =>
      setClipboardEnabled(
        ipcContext,
        cutEnabled,
        copyEnabled,
        pasteEnabled,
        deleteEnabled
      )
  );

  ipcMain.handle('close-window', async () => closeWindow(ipcContext));

  ipcMain.handle('prompt-save', async () => promptSave(ipcContext));

  ipcMain.handle('return-to-home', async (_event, project) =>
    returnToHome(ipcContext, project)
  );

  ipcMain.handle('show-confirmation', async (_event, message, detail) =>
    showConfirmation(ipcContext, message, detail)
  );
  // END GENERATED CODE PART 2
};

export default initialiseIpcHandlers;
