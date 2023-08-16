'use strict'

const path = require('path');
import { app, protocol, BrowserWindow, ipcMain, dialog, Tray ,Menu,Notification} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  const icon_path = process.env.WEBPACK_DEV_SERVER_URL ? path.join(__dirname, "/bundled/favicon.ico") : path.join(__dirname, "/favicon.ico");
  const win = new BrowserWindow({
    width: 1100,
    height: 700,
    icon: icon_path,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      webSecurity: false,
      preload: path.join(__dirname, "preload.js")
    }
  })
  win.removeMenu();
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html#/')
  }
  const tray = new Tray(icon_path);
  const contextMenu = Menu.buildFromTemplate([{
    label: '退出',
    role: 'quit',
    click: () => app.quit()
  },])
  tray.setToolTip('LyricFinder');
  tray.on('right-click', () => { tray.popUpContextMenu(contextMenu) });
  tray.on('click', () => win.show());


  ipcMain.on('close', () => {
    new Notification({
      title: "LyricFinder仍在运行",
      body: "请检查你的系统托盘"
    }).show()
    win.hide()
  });
  ipcMain.on('hide', () => win.minimize());
  ipcMain.on('maximize', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    }
    else win.maximize();
  });

  ipcMain.on("open-tools", (event, name) => {
    let toolWin = new BrowserWindow({
      width: 800,
      height: 900,
      icon: icon_path,
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, "preload.js")
      }
    })
    toolWin.removeMenu();
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      toolWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL + `#/tools/${name}`);
    } else {
      toolWin.loadURL(`app://./index.html#/tools/${name}`);
    }
    toolWin.on('closed', () => { toolWin = null });
  })

  ipcMain.handle("file-picker", async () => {
    let { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (!canceled) {
      return filePaths[0];
    }
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  // Install Vue Devtools
  //   try {
  //     await installExtension(VUEJS3_DEVTOOLS)
  //   } catch (e) {
  //     console.error('Vue Devtools failed to install:', e.toString())
  //   }
  // }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
