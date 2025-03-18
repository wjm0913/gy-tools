import { shell, clipboard, Notification, dialog } from 'electron'


/** 展示通知窗口 */
export const showNotification = async(title: string, message: string) => {
  if (!Notification.isSupported()) throw new Error('Notification is not supported')
  const notify = new Notification({
    title,
    body: message,
    icon: '',
  })
  notify.show()
}

/** 显示消息弹窗 */
export const showMessageBox = async(
  window: Electron.BrowserWindow,
  options: {
    type: Electron.MessageBoxOptions['type']
    title: string
    message: string
  },
) => {
  return dialog.showMessageBox(window, options)
}

/** 显示错误消息弹窗 */
export const showErrorBox = (title: string, message: string) => {
  dialog.showErrorBox(title, message)
}

/** 显示打开弹窗 */
export const showOpenDialog = async(
  window: Electron.BrowserWindow,
  options: {
    title: Electron.OpenDialogOptions['title']
    defaultPath: Electron.OpenDialogOptions['defaultPath']
    buttonLabel?: Electron.OpenDialogOptions['buttonLabel']
    filters: Electron.OpenDialogOptions['filters']
    properties: Electron.OpenDialogOptions['properties']
  },
) => {
  return dialog.showOpenDialog(window, options)
}

/** 显示保存弹窗 */
export const showSaveDialog = async(
  window: Electron.BrowserWindow,
  options: {
    title: Electron.SaveDialogOptions['title']
    defaultPath: Electron.SaveDialogOptions['defaultPath']
    buttonLabel?: Electron.SaveDialogOptions['buttonLabel']
    filters: Electron.SaveDialogOptions['filters']
    properties: Electron.SaveDialogOptions['properties']
  },
) => {
  return dialog.showSaveDialog(window, options)
}


/**
 * 在资源管理器中打开目录
 * @param {string} dir
 */
export const openDirInExplorer = (dir: string) => {
  shell.showItemInFolder(dir)
}


/**
 * 在浏览器打开URL
 * @param {*} url
 */
export const openUrl = async(url: string) => {
  if (!/^https?:\/\//.test(url)) return
  await shell.openExternal(url)
}


/**
 * 复制文本到剪贴板
 * @param str
 */
export const clipboardWriteText = (str: string) => {
  clipboard.writeText(str)
}

/**
 * 从剪贴板读取文本
 * @returns
 */
export const clipboardReadText = (): string => {
  return clipboard.readText()
}


export const encodePath = (path: string): string => {
  // https://github.com/lyswhut/lx-music-desktop/issues/963
  // https://github.com/lyswhut/lx-music-desktop/issues/1461
  return path.replaceAll('%', '%25').replaceAll('#', '%23')
}
