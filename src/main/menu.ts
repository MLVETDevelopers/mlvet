import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';
import handleOpenProject from './handlers/openProjectHandler';
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

  buildFileOptions(): MenuItemConstructorOptions[] {
    return [
      {
        id: 'open',
        label: 'Open...',
        accelerator: 'CommandOrControl+O',
        click: async () => {
          const { project, filePath } = await handleOpenProject(
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
          this.mainWindow.webContents.send('initiate-save-project');
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
          accelerator: 'CommandOrControl+Shift+H',
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

    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      id: 'edit', // do not change, used by IPC to find this menu
      label: 'Edit',
      submenu: [
        ...this.buildUndoRedoOptions(),
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CommandOrControl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CommandOrControl+C', selector: 'copy:' },
        {
          label: 'Paste',
          accelerator: 'CommandOrControl+V',
          selector: 'paste:',
        },
        {
          label: 'Select All',
          accelerator: 'CommandOrControl+A',
          selector: 'selectAll:',
        },
      ],
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

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [subMenuAbout, subMenuFile, subMenuEdit, subMenuView, subMenuWindow];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        id: 'file',
        label: '&File',
        submenu: this.buildFileOptions(),
      },
      {
        id: 'edit',
        label: '&Edit',
        submenu: this.buildUndoRedoOptions(),
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
        id: 'help',
        label: 'Help',
        submenu: [
          {
            label: 'Learn More',
            click() {
              shell.openExternal('https://electronjs.org');
            },
          },
          {
            label: 'Documentation',
            click() {
              shell.openExternal(
                'https://github.com/electron/electron/tree/main/docs#readme'
              );
            },
          },
          {
            label: 'Community Discussions',
            click() {
              shell.openExternal('https://www.electronjs.org/community');
            },
          },
          {
            label: 'Search Issues',
            click() {
              shell.openExternal('https://github.com/electron/electron/issues');
            },
          },
        ],
      },
    ];

    return templateDefault;
  }
}
