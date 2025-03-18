import { rendererInvoke, rendererOn, rendererSend } from '@/shared/ipcRenderer'
import { IPC_NAMES } from '../ipc/names'
import type {
  LogOutput,
  NotificationOptions,
  MessageOptions,
  OpenDialogOptions,
  SaveDialogOptions,
  OpenDialogResult,
  SaveDialogResult,
} from '../ipc/type'
import { apiEvent } from './apis/event'
import { preloadState } from './state'

/** 注册 渲染进程端 ipc 事件 */
export const registerIpcRenderer = async() => {
  rendererOn<[boolean]>(IPC_NAMES.hasDarkColorsChanged, (_event, hasDarkColors) => {
    apiEvent.hasDarkColorsChanged(hasDarkColors)
  })

  preloadState.plugin = await rendererInvoke<GYTools.Plugin>(IPC_NAMES.pluginInfo)
}

/** 获取是否暗色主题 */
export const hasDarkColors = async() => {
  return rendererInvoke<boolean>(IPC_NAMES.hasDarkColors)
}

/** 发送日志 */
export const sendLog = async(type: LogOutput['type'], messages: any[]) => {
  rendererSend<[LogOutput]>(IPC_NAMES.logOutput, {
    type,
    pluginName: preloadState.plugin.name,
    displayName: preloadState.plugin.displayName,
    messages: messages.map(m => (m instanceof Error ? m.stack ?? m.message : String(m))),
  })
}

/** 发送通知 */
export const sendNotification = (title: string, message: string) => {
  rendererSend<[NotificationOptions]>(IPC_NAMES.notification, {
    title,
    message,
  })
}

/** 发送消息弹窗 */
export const sendMessageBox = (options: MessageOptions) => {
  rendererSend<[MessageOptions]>(IPC_NAMES.messageBox, options)
}

/** 发送错误弹窗 */
export const sendErrorBox = (title: string, message: string) => {
  rendererSend<[NotificationOptions]>(IPC_NAMES.errorBox, {
    title,
    message,
  })
}

/** 发送打开弹窗 */
export const sendOpenDialog = async(options: OpenDialogOptions) => {
  return rendererInvoke<[OpenDialogOptions], OpenDialogResult>(IPC_NAMES.openDialog, options)
}

/** 发送保存弹窗 */
export const sendSaveDialog = async(options: SaveDialogOptions) => {
  return rendererInvoke<[SaveDialogOptions], SaveDialogResult>(IPC_NAMES.saveDialog, options)
}

// /** 存储数据 */
// export const storageSetData = async(data: string) => {
//   await rendererInvoke<[string, string]>(IPC_NAMES.storageSetData, preloadState.plugin.name, data)
// }

// /** 获取数据 */
// export const storageGetData = async() => {
//   return rendererInvoke<[string], string>(IPC_NAMES.storageGetData, preloadState.plugin.name)
// }


// export const locale = async (): Promise<string> => {
//   return ipcRenderer.invoke(IPC_NAMES.locale);
// };
