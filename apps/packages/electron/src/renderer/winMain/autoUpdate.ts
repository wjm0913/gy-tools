import { autoUpdater } from 'electron-updater'
import { log } from '@/shared/log'
import { appState } from '@/app'
import { rendererIPC } from './rendererEvent'
import { showDialog } from './main'
import { isWin } from '@/shared/common'

autoUpdater.logger = log
autoUpdater.autoDownload = false
// autoUpdater.forceDevUpdateConfig = true
// autoUpdater.autoDownload = false

// let isFirstCheckedUpdate = true

// log.info('App starting...')

// 检查是否是开发模式
const isDev = process.env.NODE_ENV === 'development'

function sendStatusToWindow(text: string) {
  log.info(text)
  // ipcMain.send('message', text)
}
let prestatus: 'downloaded' | 'downloading' | 'error' | 'checking' | 'idle' = 'idle'

export const initUpdate = () => {
  if (isDev) {
    console.log('开发模式下禁用自动更新')
    return
  }
  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...')
    void rendererIPC.updateInfo({
      type: 'checking',
    })
    prestatus = 'checking'
  })
  autoUpdater.on('update-available', info => {
    sendStatusToWindow('Update available.')
    void rendererIPC.updateInfo({
      type: 'available',
      info: {
        version: info.version,
        isAutoUpdate: appState.appSetting['common.tryAutoUpdate'],
        // url: info.
        log: info.releaseNotes as string,
        // isForce: boolean
      },
    })
    if (appState.appSetting['common.tryAutoUpdate']) {
      void showDialog({
        type: 'info',
        message: '发现新版本，正在尝试下载更新...',
      })
    } else {
      void showDialog({
        type: 'question',
        message: '发现新版本，是否立即下载更新？',
        buttons: isWin ? [
          'No',
          'Yes',
        ] : [
          '否',
          '是',
        ],
      }).then(val => {
        if (val?.response == 1) {
          void downloadUpdate()
        }
      })
    }
    prestatus = 'idle'
  })
  autoUpdater.on('update-not-available', info => {
    sendStatusToWindow('Update not available.')
    void rendererIPC.updateInfo({
      type: 'not-available',
    })
    prestatus = 'idle'
  })
  autoUpdater.on('error', err => {
    sendStatusToWindow('Error in auto-updater: ' + err.message)
    void rendererIPC.updateInfo({
      type: 'error',
    })
    if (prestatus != 'checking') {
      void showDialog({
        type: 'error',
        message: '自动更新失败，请手动下载更新',
        buttons: [
          'Yes',
        ],
      }).then(val => {

      })
    }
    prestatus = 'error'
  })
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = `Download speed: ${progressObj.bytesPerSecond}`
    log_message = `${log_message} - Downloaded ${progressObj.percent}%`
    log_message = `${log_message} (${progressObj.transferred}/${progressObj.total})`
    sendStatusToWindow(log_message)
    void rendererIPC.updateInfo({
      type: 'download-progress',
      info: {
        speed: progressObj.bytesPerSecond,
        percent: progressObj.percent,
        total: progressObj.total,
        current: progressObj.transferred,
      },
    })
    prestatus = 'downloading'
  })
  autoUpdater.on('update-downloaded', () => {
    sendStatusToWindow('Update downloaded.')
    void rendererIPC.updateInfo({
      type: 'downloaded',
    })
    void showDialog({
      type: 'question',
      message: '更新已经下载完成，是否立即重启程序安装更新？',
      buttons: isWin ? [
        'No',
        'Yes',
      ] : [
        '否',
        '是',
      ],
    }).then(val => {
      if (val?.response == 1) {
        restartUpdate()
      }
    })
    prestatus = 'downloaded'
  })
}

export const checkUpdate = () => {
  console.log(appState.appSetting['common.tryAutoUpdate'])
  // 由于集合安装包中不包含win arm版，这将会导致arm版更新失败
  // if (isWin && process.arch.includes('arm')) {
  //   handleSendEvent({ type: WIN_MAIN_RENDERER_EVENT_NAME.update_error, info: 'failed' })
  // } else {
  autoUpdater.autoDownload = appState.appSetting['common.tryAutoUpdate']
  if (isDev) {
    console.log('开发模式下禁用自动更新')
    return
  }
  void autoUpdater.checkForUpdates()
  // }
}

export const downloadUpdate = async() => {
  if (!autoUpdater.isUpdaterActive()) return
  void autoUpdater.downloadUpdate()
}

export const restartUpdate = () => {
  // appActions.setSkipTrayQuit(true)
  setTimeout(() => {
    autoUpdater.quitAndInstall(true, true)
  }, 1000)
}
