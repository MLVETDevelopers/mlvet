/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { ChildProcess } from 'child_process';
import dotenv from 'dotenv';
import { app, BrowserWindow } from 'electron';
import AppState from './AppState';
import startExpressServer from './expressServer';
import initialiseIpcHandlers from './ipc';
import MenuBuilder from './menu';
import promptToSaveWork from './promptToSaveWork';
import { pingServer, startServer } from './pyServer';
import { IpcContext } from './types';
import { appDataStoragePath, isDevelopment, mkdir } from './util';
import createWindow from './window';

let pyServer: ChildProcess | null = null;

dotenv.config();

// If app data storage path doesn't exist, create it
mkdir(appDataStoragePath());

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDevelopment) {
  require('electron-debug')();
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // For simplicity, quit even on mac
  app.quit();

  if (pyServer !== null) {
    pyServer.kill(0);
  }
});

app
  .whenReady()
  .then(async () => {
    let mainWindow: BrowserWindow | null = await createWindow();

    const menuBuilder = new MenuBuilder(mainWindow);
    const menu = menuBuilder.buildMenu();

    const appState = new AppState(mainWindow);

    const ipcContext: IpcContext = {
      mainWindow,
      menu,
      appState,
    };

    initialiseIpcHandlers(ipcContext);

    mainWindow.on('ready-to-show', async () => {
      if (!mainWindow) {
        throw new Error('"mainWindow" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        mainWindow.minimize();
      } else {
        mainWindow.show();
      }

      pyServer = startServer();

      pingServer(pyServer);

      startExpressServer();
    });

    mainWindow.on('closed', () => {
      mainWindow = null;

      if (pyServer !== null) {
        pyServer.kill();
      }
    });

    mainWindow.on('close', (event) => {
      if (mainWindow === null) {
        return; // let the close action go ahead as normal
      }

      // If the user has unsaved work, prompt them to save it
      if (promptToSaveWork(mainWindow, appState)) {
        return; // app can continue closing
      }

      event.preventDefault(); // app cannot close
    });

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
