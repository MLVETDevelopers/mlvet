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
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { get } from 'http';
import path from 'path';
import MenuBuilder from './menu';
import startServer from './pyServer';
import { appDataStoragePath, mkdir, resolveHtmlPath } from './util';
import initialiseIpcHandlers from './ipc';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let pyServer: ChildProcess | null = null;
dotenv.config();

// If app data storage path doesn't exist, create it
mkdir(appDataStoragePath());

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  const ipcContext: IpcContext = {
    mainWindow,
  };

  initialiseIpcHandlers(ipcContext);

  mainWindow.loadURL(resolveHtmlPath('index.html'));

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

    if (pyServer !== null && pyServer.stderr !== null) {
      // Flask logs to stderr when server is ready. Hence, we listen to stderr rather than stdout
      // More information why we listen to stderr here: https://github.com/patrickbrett/mlvet/pull/3#discussion_r830701799
      pyServer.stderr.once('data', (data) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(data.toString()); // prints address that the server is running on. TODO: remove before it is electron app is built
        }
        get(`http://localhost:${process.env.FLASK_PORT}`, (res) => {
          if (res.statusCode === 200) {
            console.log('Python server is running');
          } else {
            throw new Error(
              `Python server has an error, response to a get '/' expected code 200 got ${res.statusCode}`
            );
          }
        });
      });
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (pyServer !== null) {
      pyServer.kill();
    }
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  const menu = menuBuilder.buildMenu();
  menuBuilder.setListeners(menu, ipcMain);

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
    if (pyServer !== null) {
      pyServer.kill(0);
    }
  }
});

app
  .whenReady()
  .then(async () => {
    createWindow();

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
