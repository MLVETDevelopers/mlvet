import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';
import { handleOpenProject } from './handlers';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setListeners: (menu: Menu, ipcMain: IpcMain) => void = (menu, ipcMain) => {
    ipcMain.handle(
      'set-undo-redo-enabled',
      (_event, undoEnabled: boolean, redoEnabled: boolean) => {
        const editSubmenu = menu.items.find((submenu) => submenu.id === 'edit');

        if (!editSubmenu) {
          return;
        }

        const undoButton = editSubmenu.submenu?.items.find(
          (item) => item.id === 'undo'
        );
        const redoButton = editSubmenu.submenu?.items.find(
          (item) => item.id === 'redo'
        );

        if (!undoButton || !redoButton) {
          return;
        }

        undoButton.enabled = undoEnabled;
        redoButton.enabled = redoEnabled;
      }
    );
  };

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
      label: 'File',
      submenu: [
        {
          label: 'Save Project',
          accelerator: 'CommandOrControl+S',
          click: () => {
            // Tell the renderer to initiate a save
            this.mainWindow.webContents.send('initiate-save-project');
          },
        },
        {
          label: 'Open Project',
          accelerator: 'CommandOrControl+O',
          click: async () => {
            const { project, filePath } = await handleOpenProject(
              this.mainWindow
            );

            this.mainWindow.webContents.send(
              'project-opened',
              project,
              filePath
            );
          },
        },
      ],
    };

    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      id: 'edit', // do not change, used by IPC to find this menu
      label: 'Edit',
      submenu: [
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
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O',
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      {
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
