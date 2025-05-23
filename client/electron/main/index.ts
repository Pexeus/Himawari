import { app, BrowserWindow, shell, ipcMain, nativeTheme } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import fs from "fs"
import AutoLaunch from 'auto-launch';
import { spawn } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pidFile = path.join(app.getPath('userData'), 'daemon.pid');
const configFile = path.join(__dirname, 'config.json')

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

console.log(process.execPath);

// Configure auto-launch for the background process
const autoLauncher = new AutoLaunch({
  name: 'MyAppBackground',
  path: process.execPath,
  isHidden: true,
});

function restartDaemon() {
  if (fs.existsSync(pidFile)) {
    const pid = parseInt(fs.readFileSync(pidFile, 'utf-8'))
    try {
      console.log(`Terminating process ${pid}`);
      process.kill(pid, 'SIGTERM')
    }
    catch (err: any) {
      if (err.code != 'ESRCH') {
        throw new Error(`Failed to kill old process: ${err}`)
      }

      console.log(`No Process running with PID ${pid}`);
    }
  }

  const daemon = spawn('node', [
    path.join(__dirname, 'daemon.js'),
  ], {
    detached: true,
    windowsHide: false
  });

  fs.writeFileSync(pidFile, String(daemon.pid))
}

app.whenReady().then(async () => {
  nativeTheme.themeSource = 'dark'
  restartDaemon()
  createWindow()

  const enabled = await autoLauncher.isEnabled()

  if (!enabled) {
    await autoLauncher.enable()
    console.log('autolaunch enabled');
  }
})

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    resizable: false,
    fullscreenable: false,
    darkTheme: false,
    frame: false,
    title: 'Himawari',
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    width: 350,
    height: 520,
    x: 2450,
    y: 200,
    webPreferences: {
      preload,
    },
    backgroundMaterial: 'acrylic'
  })

  if (VITE_DEV_SERVER_URL) { // #298
    win.loadURL(VITE_DEV_SERVER_URL)
    // Open devTool if the app is not packaged
    //win.webContents.openDevTools({ mode: 'undocked' })
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('config-get', getConfig())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  win.webContents.on("ipc-message", (event, channel, args) => {
    if (channel == 'config-set') {
      setConfig(JSON.parse(args))
      restartDaemon()
    }
  })
}

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

function getConfig() {
  if (!fs.existsSync(configFile)) {
    throw new Error(`Cannot find Config file at ${configFile}`)
  }

  return JSON.parse(fs.readFileSync(configFile, 'utf-8'))
}


function setConfig(config) {
  if (!fs.existsSync(configFile)) {
    throw new Error(`Cannot find Config file at ${configFile}`)
  }

  fs.writeFileSync(configFile, JSON.stringify(config, null, 2))
}