import { mainHandle, mainOn, mainSend } from '@/shared/ipcMain'
import { IPC_NAMES } from './names'
import { appState } from '@/app/state'
import { appEvent } from '@/app/event'
import { winMainState } from '@/renderer/winMain/state'
import {
  showNotification,
  showMessageBox,
  showErrorBox,
  showOpenDialog,
  showSaveDialog,
} from '@/shared/electron'
import { pluginState } from '../state'
import type {
  LogOutput,
  NotificationOptions,
  MessageOptions,
  OpenDialogOptions,
  OpenDialogResult,
  SaveDialogOptions,
  SaveDialogResult,
} from './type'
import { pluginEvent } from '../event'

/**
 * 向所有运行的插件广播消息
 * @param name 消息名字
 * @param params 参数
 */
const broadcastMessage = <T extends any[]>(name: IPC_NAMES, ...params: T) => {
  for (const { view } of pluginState.runningPlugins.values()) {
    mainSend(view.webContents, name, ...params)
  }
}

/**
 * 初始化 main 端 ipc
 */
export const initIpcMain = () => {
  mainHandle<boolean>(IPC_NAMES.hasDarkColors, async() => {
    return appState.shouldUseDarkColors
  })
  mainHandle<GYTools.Plugin>(IPC_NAMES.pluginInfo, async event => {
    const targetPlugin = Array.from(pluginState.runningPlugins.values()).find(p => {
      return p.view.webContents === event.sender
    })
    if (!targetPlugin) throw new Error('plugin not found')
    return targetPlugin.info
  })
  mainOn<[LogOutput]>(IPC_NAMES.logOutput, (_event, log) => {
    pluginEvent.logOutput(log)
  })
  mainOn<[NotificationOptions]>(IPC_NAMES.notification, (_event, opts) => {
    showNotification(opts.title, opts.message)
  })
  mainOn<[MessageOptions]>(IPC_NAMES.messageBox, (_event, opts) => {
    if (!winMainState.browserWindow) return
    showMessageBox(winMainState.browserWindow, {
      type: opts.type,
      title: opts.title,
      message: opts.message,
    })
  })
  mainOn<[NotificationOptions]>(IPC_NAMES.errorBox, (_event, opts) => {
    showErrorBox(opts.title, opts.message)
  })
  mainHandle<[OpenDialogOptions], OpenDialogResult>(IPC_NAMES.openDialog, async(_event, opts) => {
    if (!winMainState.browserWindow) throw new Error('mainWindow not defined')
    const ret = await showOpenDialog(winMainState.browserWindow, {
      title: opts.title,
      defaultPath: opts.defaultPath,
      buttonLabel: opts.buttonLabel,
      filters: opts.filters,
      properties: opts.properties,
    })
    return {
      canceled: ret.canceled,
      filePaths: ret.filePaths,
    }
  })
  mainHandle<[SaveDialogOptions], SaveDialogResult>(IPC_NAMES.saveDialog, async(_event, opts) => {
    if (!winMainState.browserWindow) throw new Error('mainWindow not defined')
    const ret = await showSaveDialog(winMainState.browserWindow, {
      title: opts.title,
      defaultPath: opts.defaultPath,
      buttonLabel: opts.buttonLabel,
      filters: opts.filters,
      properties: opts.properties,
    })
    return {
      canceled: ret.canceled,
      filePath: ret.filePath,
    }
  })
  // ipcMain.on(IPC_NAMES.locale, async () => {
  //   return 'zh-cn';
  // });

  appEvent.on('system_theme_change', (shouldUseDarkColors) => {
    broadcastMessage<[boolean]>(IPC_NAMES.hasDarkColorsChanged, shouldUseDarkColors)
  })
}
