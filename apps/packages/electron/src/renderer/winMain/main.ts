import { BrowserWindow, dialog, session } from 'electron'
import path from 'node:path'
import { openDevTools as handleOpenDevTools } from '@/shared/utils'
import { encodePath } from '@/shared/electron'
import { winMainEvent } from './event'
import { DEV_SERVER_PORTS } from '@gy-tools/common/constants'
import { isLinux, isWin } from '@/shared/common'
import { winMainState } from './state'


const winEvent = () => {
  if (!winMainState.browserWindow) return

  winMainState.browserWindow.on('close', event => {
    // if (appState.isSkipTrayQuit || !appState.appSetting['tray.enable']) {
    winMainState.browserWindow!.setProgressBar(-1)
    winMainEvent.close()
    // return
    // }

    // event.preventDefault()
    // winMainState.browserWindow!.hide()
  })

  winMainState.browserWindow.on('closed', () => {
    winMainState.browserWindow = null
  })

  // winMainState.browserWindow.on('restore', () => {
  //   winMainState.browserWindow.webContents.send('restore')
  // })
  winMainState.browserWindow.on('focus', () => {
    // TODO
    winMainEvent.focus()
  })

  winMainState.browserWindow.on('blur', () => {
    winMainEvent.blur()
  })

  winMainState.browserWindow.once('ready-to-show', () => {
    // showWindow()
    winMainEvent.ready_to_show()
  })

  winMainState.browserWindow.on('show', () => {
    winMainEvent.show()
  })
  winMainState.browserWindow.on('hide', () => {
    winMainEvent.hide()
  })
}


export const createWindow = () => {
  closeWindow()

  const ses = session.fromPartition('persist:win-main')

  const preloadUrl = path.join(encodePath(__dirname), './win-main.preload.js')

  /**
   * Initial window options
   */
  const options: Electron.BrowserWindowConstructorOptions = {
    useContentSize: true,
    frame: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#ffffff',
      // symbolColor: '#74b1be',
      height: 30,
    },
    transparent: false,
    minWidth: 600,
    minHeight: 300,
    width: 1050,
    height: 650,
    // enableRemoteModule: false,
    // icon: join(appState.__static, isWin ? 'icons/256x256.ico' : 'icons/512x512.png'),
    resizable: true,
    maximizable: true,
    fullscreenable: true,
    show: true,
    backgroundColor: '#fff',
    webPreferences: {
      preload: preloadUrl,
      session: ses,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      webSecurity: false,
      nodeIntegration: false,
      sandbox: false,
      enableWebSQL: false,
      webgl: false,
      spellcheck: false, // 禁用拼写检查器
    },
  }
  winMainState.browserWindow = new BrowserWindow(options)

  const winURL = process.env.NODE_ENV !== 'production'
    ? `http://localhost:${DEV_SERVER_PORTS['win-main']}?env=${process.platform}`
    : `file://${path.join(encodePath(__dirname), '../win-main/index.html')}?env=${process.platform}`
  void winMainState.browserWindow.loadURL(winURL)

  winEvent()

  // global.GYTools.mainWindowClosed = false
  // winMainState.browserWindow.webContents.openDevTools()
}

export const isExistWindow = (): boolean => !!winMainState.browserWindow
export const isShowWindow = (): boolean => {
  if (!winMainState.browserWindow) return false
  return winMainState.browserWindow.isVisible() && (isWin ? true : winMainState.browserWindow.isFocused())
}

export const closeWindow = () => {
  if (!winMainState.browserWindow) return
  winMainState.browserWindow.close()
  winMainState.browserWindow = null
}

export const showSelectDialog = async(options: Electron.OpenDialogOptions) => {
  if (!winMainState.browserWindow) throw new Error('main window is undefined')
  return dialog.showOpenDialog(winMainState.browserWindow, options)
}
export const showDialogSync = ({ type, message, detail }: Electron.MessageBoxSyncOptions) => {
  if (!winMainState.browserWindow) return
  dialog.showMessageBoxSync(winMainState.browserWindow, {
    type,
    message,
    detail,
  })
}
export const showDialog = async(opts: Electron.MessageBoxSyncOptions) => {
  if (!winMainState.browserWindow) return
  return dialog.showMessageBox(winMainState.browserWindow, opts)
}
export const showSaveDialog = async(options: Electron.SaveDialogOptions) => {
  if (!winMainState.browserWindow) throw new Error('main window is undefined')
  return dialog.showSaveDialog(winMainState.browserWindow, options)
}
export const minimize = () => {
  if (!winMainState.browserWindow) return
  winMainState.browserWindow.minimize()
}
export const maximize = () => {
  if (!winMainState.browserWindow) return
  winMainState.browserWindow.maximize()
}
export const unmaximize = () => {
  if (!winMainState.browserWindow) return
  winMainState.browserWindow.unmaximize()
}
export const toggleHide = () => {
  if (!winMainState.browserWindow) return
  winMainState.browserWindow.isVisible()
    ? winMainState.browserWindow.hide()
    : winMainState.browserWindow.show()
}
export const toggleMinimize = () => {
  if (!winMainState.browserWindow) return
  if (winMainState.browserWindow.isVisible()) {
    if (winMainState.browserWindow.isMinimized()) winMainState.browserWindow.restore()
    else winMainState.browserWindow.minimize()
  } else winMainState.browserWindow.show()
}
export const showWindow = () => {
  if (!winMainState.browserWindow) return
  if (winMainState.browserWindow.isVisible()) {
    if (winMainState.browserWindow.isMinimized()) winMainState.browserWindow.restore()
    else winMainState.browserWindow.focus()
  } else winMainState.browserWindow.show()
}
export const hideWindow = () => {
  if (!winMainState.browserWindow) return
  winMainState.browserWindow.hide()
}
export const setWindowBounds = (options: Partial<Electron.Rectangle>) => {
  if (!winMainState.browserWindow) return
  winMainState.browserWindow.setBounds(options)
}
export const setProgressBar = (progress: number, options?: Electron.ProgressBarOptions) => {
  if (!winMainState.browserWindow) return
  winMainState.browserWindow.setProgressBar(progress, options)
}
export const setIgnoreMouseEvents = (ignore: boolean, options?: Electron.IgnoreMouseEventsOptions) => {
  if (!winMainState.browserWindow) return
  winMainState.browserWindow.setIgnoreMouseEvents(ignore, options)
}
export const toggleDevTools = () => {
  if (!winMainState.browserWindow) return
  if (winMainState.browserWindow.webContents.isDevToolsOpened()) {
    winMainState.browserWindow.webContents.closeDevTools()
  } else {
    handleOpenDevTools(winMainState.browserWindow.webContents)
  }
}

export const setFullScreen = (isFullscreen: boolean): boolean => {
  if (!winMainState.browserWindow) return false
  if (isLinux) { // linux 需要先设置为可调整窗口大小才能全屏
    if (isFullscreen) {
      winMainState.browserWindow.setResizable(isFullscreen)
      winMainState.browserWindow.setFullScreen(isFullscreen)
    } else {
      winMainState.browserWindow.setFullScreen(isFullscreen)
      winMainState.browserWindow.setResizable(isFullscreen)
    }
  } else {
    winMainState.browserWindow.setFullScreen(isFullscreen)
  }
  return isFullscreen
}


export const clearCache = async() => {
  if (!winMainState.browserWindow) throw new Error('main window is undefined')
  await winMainState.browserWindow.webContents.session.clearCache()
}

export const getCacheSize = async() => {
  if (!winMainState.browserWindow) throw new Error('main window is undefined')
  return winMainState.browserWindow.webContents.session.getCacheSize()
}

export const getWebContents = (): Electron.WebContents => {
  if (!winMainState.browserWindow) throw new Error('main window is undefined')
  return winMainState.browserWindow.webContents
}
