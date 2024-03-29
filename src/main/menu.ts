import { app, Menu, BrowserWindow, MenuItemConstructorOptions } from 'electron';
import { ExportFormat } from '../sharedTypes';
import openProject from './handlers/file/openProjectHandler';
import { IpcContext } from './types';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  isDarwin: () => boolean = () => {
    return process.platform === 'darwin'; // macos
  };

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template = this.isDarwin()
      ? this.buildDarwinTemplate()
      : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildUndoRedoOptions(): MenuItemConstructorOptions[] {
    return [
      {
        id: 'undo', // do not change, used by IPC to listen for enable/disable undo
        label: 'Undo',
        accelerator: 'CommandOrControl+Z',
        click: () => {
          // Tell the renderer to initiate an undo
          this.mainWindow.webContents.send('initiate-undo');
        },
        enabled: false, // initially disabled, becomes enabled when there are things to undo
      },
      {
        id: 'redo', // do not change, used by IPC to listen for enable/disable redo
        label: 'Redo',
        accelerator: 'Shift+CommandOrControl+Z',
        click: () => {
          // Tell the renderer to initiate a redo
          this.mainWindow.webContents.send('initiate-redo');
        },
        enabled: false, // initially disabled, becomes enabled when there are things to redo
      },
    ];
  }

  buildClipboardOptions(): MenuItemConstructorOptions[] {
    return [
      {
        id: 'cut',
        role: 'cut',
        accelerator: 'CommandOrControl+X',
      },
      {
        id: 'copy',
        role: 'copy',
        accelerator: 'CommandOrControl+C',
      },
      {
        id: 'paste',
        role: 'paste',
        accelerator: 'CommandOrControl+V',
      },
      {
        id: 'delete',
        label: 'Delete',
        accelerator: 'Backspace',
        click: () => {
          // Tell the renderer to initiate a delete
          this.mainWindow.webContents.send('initiate-delete-text');
        },
      },
      {
        // Hidden menu item to allow both backspace and delete to be used for the same purpose
        id: 'delete2',
        label: 'delete (invisible)',
        accelerator: 'Delete',
        visible: false,
        acceleratorWorksWhenHidden: true,
        click: () => {
          // Tell the renderer to initiate a delete
          this.mainWindow.webContents.send('initiate-delete-text');
        },
      },
      {
        id: 'selectAll',
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectAll',
      },
      {
        id: 'selectSentence',
        label: 'Select Current Sentence',
        accelerator: 'CmdOrCtrl+Shift+A',
        click: () => {
          // Tell the renderer to initiate a select-all
          this.mainWindow.webContents.send('initiate-select-sentence');
        },
        enabled: false, // initially disabled, becomes enabled when there is a sentence to select
      },
    ];
  }

  buildEditorAdditionalOptions(): MenuItemConstructorOptions[] {
    return [
      {
        id: 'editWord',
        label: 'Edit Word',
        accelerator: 'E',
        click: () => {
          this.mainWindow.webContents.send('initiate-edit-word');
        },
        enabled: false, // by default, gets updated when selection changes
      },
      {
        id: 'mergeWords',
        label: 'Merge Words',
        accelerator: 'CommandOrControl+L', // 'M' already taken by window 'minimize'
        click: () => {
          // Tell the renderer to initiate a merge-words operation
          this.mainWindow.webContents.send('initiate-merge-words');
        },
        enabled: false, // by default, gets updated when selection changes
      },
      {
        id: 'splitWord',
        label: 'Split Word',
        accelerator: 'Shift+CommandOrControl+L',
        click: () => {
          // Tell the renderer to initiate a split-words operation
          this.mainWindow.webContents.send('initiate-split-word');
        },
        enabled: false, // by default, gets updated when selection changes
      },
      {
        id: 'confidence',
        label: 'Toggle Confidence Underlines',
        accelerator: 'CommandOrControl+U',
        click: () => {
          // Tell the renderer to toggle the confidence underlines
          this.mainWindow.webContents.send('toggle-confidence-underlines');
        },
        enabled: false, // by default, gets updated when a project is entered
      },
      {
        id: 'find',
        label: 'Find...',
        accelerator: 'CommandOrControl+F',
        click: () => {
          // Tell the renderer to toggle the confidence underlines
          this.mainWindow.webContents.send('toggle-ctrl-f-popover');
        },
        enabled: false, // by default, gets updated when a project is entered
      },
    ];
  }

  buildFileOptions(): MenuItemConstructorOptions[] {
    return [
      {
        id: 'open',
        label: 'Open...',
        accelerator: 'CommandOrControl+O',
        click: async () => {
          const { project, filePath } = await openProject(
            { mainWindow: this.mainWindow } as IpcContext,
            null
          );

          this.mainWindow.webContents.send('project-opened', project, filePath);
        },
      },
      {
        id: 'save',
        label: 'Save',
        accelerator: 'CommandOrControl+S',
        click: () => {
          // Tell the renderer to initiate a save
          this.mainWindow.webContents.send('initiate-save-project', false);
        },
        enabled: false,
      },
      {
        id: 'saveAs',
        label: 'Save As...',
        accelerator: 'CommandOrControl+Shift+S',
        click: () => {
          // Tell the renderer to initiate a save-as
          this.mainWindow.webContents.send('initiate-save-as-project');
        },
        enabled: false,
      },
      {
        id: 'exportEdl',
        label: 'Export Project to EDL',
        accelerator: 'CommandOrControl+E',
        click: () => {
          this.mainWindow.webContents.send(
            'initiate-export-project',
            ExportFormat.EDL
          );
        },
      },
      {
        id: 'exportMp4',
        label: 'Export Project to MP4',
        accelerator: 'CommandOrControl+Shift+E',
        click: () => {
          this.mainWindow.webContents.send(
            'initiate-export-project',
            ExportFormat.MP4
          );
        },
      },
      {
        id: 'updateTranscriptionAPIKey',
        label: 'Update Transcription API Key',
        accelerator: 'CommandOrControl+K',
        click: () => {
          this.mainWindow.webContents.send('open-update-transcription-api-key');
        },
      },
      {
        id: 'updateTranscriptionChoice',
        label: 'Switch Transcription Engine',
        accelerator: 'CommandOrControl+=',
        click: () => {
          this.mainWindow.webContents.send('open-update-transcription-choice');
        },
      },
    ];
  }

  buildEditOptions(): MenuItemConstructorOptions {
    return {
      id: 'edit', // do not change, used by IPC to find this menu
      label: 'Edit',
      submenu: [
        ...this.buildUndoRedoOptions(),
        { type: 'separator' },
        ...this.buildClipboardOptions(),
        { type: 'separator' },
        ...this.buildEditorAdditionalOptions(),
      ],
    };
  }

  buildHistoryOptions(): MenuItemConstructorOptions[] {
    return [
      {
        id: 'home',
        label: 'Home',
        accelerator: 'Shift+CommandOrControl+H',
        click: () => {
          this.mainWindow.webContents.send('initiate-return-to-home');
        },
        enabled: false,
      },
    ];
  }

  buildHelpOptions(): MenuItemConstructorOptions[] {
    return [
      {
        label: 'Keyboard Shortcuts',
        click: () => {
          this.mainWindow.webContents.send('open-shortcuts');
        },
      },
    ];
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'MLVET',
      submenu: [
        {
          label: 'About Machine Learning Video Editor Toolkit',
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        {
          label: 'Hide MLVET',
          accelerator: 'CommandOrControl+H',
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: 'CommandOrControl+Alt+H',
          selector: 'hideOtherApplications:',
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'CommandOrControl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };

    const subMenuFile: DarwinMenuItemConstructorOptions = {
      id: 'file',
      label: 'File',
      submenu: this.buildFileOptions(),
    };

    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CommandOrControl+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+CommandOrControl+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+CommandOrControl+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };

    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+CommandOrControl+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };

    const subMenuHistory: MenuItemConstructorOptions = {
      id: 'history',
      label: 'History',
      submenu: this.buildHistoryOptions(),
    };

    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CommandOrControl+M',
          selector: 'performMiniaturize:',
        },
        {
          label: 'Close',
          accelerator: 'CommandOrControl+W',
          selector: 'performClose:',
        },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };

    const subMenuHelp: DarwinMenuItemConstructorOptions = {
      id: 'help',
      label: 'Help',
      submenu: this.buildHelpOptions(),
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [
      subMenuAbout,
      subMenuFile,
      this.buildEditOptions(),
      subMenuView,
      subMenuHistory,
      subMenuWindow,
      subMenuHelp,
    ];
  }

  buildDefaultTemplate(): MenuItemConstructorOptions[] {
    const templateDefault = [
      {
        id: 'file',
        label: '&File',
        submenu: this.buildFileOptions(),
      },
      {
        id: 'edit',
        label: '&Edit',
        submenu: [
          ...this.buildUndoRedoOptions(),
          ...this.buildClipboardOptions(),
          ...this.buildEditorAdditionalOptions(),
        ],
      },
      {
        id: 'view',
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  },
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  },
                },
              ],
      },
      {
        id: 'history',
        label: '&History',
        submenu: this.buildHistoryOptions(),
      },
      {
        id: 'help',
        label: 'Help',
        submenu: this.buildHelpOptions(),
      },
    ];

    return templateDefault;
  }
}
