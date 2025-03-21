export interface LogOutput {
  type: 'debug' | 'info' | 'warn' | 'error'
  pluginName: string
  displayName: string
  messages: string[]
}

export interface NotificationOptions {
  title: string
  message: string
}

export interface MessageOptions {
  type: Electron.MessageBoxOptions['type']
  title: string
  message: string
}

export interface OpenDialogOptions {
  title: Electron.OpenDialogOptions['title']
  defaultPath?: Electron.OpenDialogOptions['defaultPath']
  buttonLabel?: Electron.OpenDialogOptions['buttonLabel']
  filters?: Electron.OpenDialogOptions['filters']
  properties?: Electron.OpenDialogOptions['properties']
}
export interface OpenDialogResult {
  canceled: boolean
  filePaths: string[]
}

export interface SaveDialogOptions {
  title: Electron.SaveDialogOptions['title']
  defaultPath?: Electron.SaveDialogOptions['defaultPath']
  buttonLabel?: Electron.SaveDialogOptions['buttonLabel']
  filters?: Electron.SaveDialogOptions['filters']
  properties?: Electron.SaveDialogOptions['properties']
}
export interface SaveDialogResult {
  canceled: boolean
  filePath: string
}
