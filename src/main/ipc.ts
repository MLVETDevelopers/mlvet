import { BrowserWindow, ipcMain } from 'electron';
import showImportMediaDialog from './handlers/fileDialog';
import {
  handleTranscription,
  extractThumbnail,
  extractAudio,
  handleSaveProject,
  handleOpenProject,
  readRecentProjects,
  writeRecentProjects,
  retrieveProjectMetadata,
  handleSaveAsProject,
  handleOsQuery,
  getFileNameWithExtension,
} from './handlers';

const initialiseIpcHandlers: (mainWindow: BrowserWindow) => void = (
  mainWindow
) => {
  ipcMain.handle('import-media', () => showImportMediaDialog(mainWindow));

  ipcMain.handle('transcribe-media', async (_event, project) =>
    handleTranscription(project)
  );

  ipcMain.handle('extract-thumbnail', async (_event, filePath) =>
    extractThumbnail(filePath)
  );

  ipcMain.handle('save-project', async (_event, project) =>
    handleSaveProject(mainWindow, project)
  );

  ipcMain.handle('save-as-project', async (_event, project) =>
    handleSaveAsProject(mainWindow, project)
  );

  ipcMain.handle('open-project', async (_event, filePath: string | null) =>
    handleOpenProject(filePath, mainWindow)
  );

  ipcMain.handle('read-recent-projects', async () => readRecentProjects());

  ipcMain.handle('write-recent-projects', async (_event, recentProjects) =>
    writeRecentProjects(recentProjects)
  );

  ipcMain.handle('retrieve-project-metadata', async (_event, project) =>
    retrieveProjectMetadata(project)
  );

  ipcMain.handle('user-os', async () => handleOsQuery());

  ipcMain.handle('file-name-with-ext', async (_event, filePath) =>
    getFileNameWithExtension(filePath)
  );

  ipcMain.handle('extract-audio', async (_event, project) =>
    extractAudio(project)
  );
};

export default initialiseIpcHandlers;
