// 可调用的electron端通用方法


interface FileFilter {
  // Docs: https://electronjs.org/docs/api/structures/file-filter

  extensions: string[]
  name: string
}
interface OpenDialogOptions {
  title: string
  defaultPath?: string
  buttonLabel?: string
  filters?: FileFilter[]
  /** Contains which features the dialog should use. The following values are supported: */
  properties?: Array<
  | 'openFile'
  | 'openDirectory'
  | 'multiSelections'
  | 'showHiddenFiles'
  | 'createDirectory'
  | 'promptToCreate'
  | 'noResolveAliases'
  | 'treatPackageAsDirectory'
  | 'dontAddToRecent'
  >
}
interface OpenDialogResult {
  canceled: boolean
  filePaths: string[]
}

interface SaveDialogOptions {
  title: string
  defaultPath?: string
  buttonLabel?: string
  filters?: FileFilter[]
  properties?: Array<
  | 'showHiddenFiles'
  | 'createDirectory'
  | 'treatPackageAsDirectory'
  | 'showOverwriteConfirmation'
  | 'dontAddToRecent'
  >
}
interface SaveDialogResult {
  canceled: boolean
  filePath: string
}
export declare type ElectronActions = WarpPromiseRecord<{
  /** UI 初始完成 */
  inited: () => void
  /** 最小化窗口 */
  minWindow: () => void
  /** 关闭窗口 */
  closeWindow: (isForce?: boolean) => void

  /** 获取配置 */
  getSetting: () => GYTools.AppSetting
  /** 更新配置 */
  setSetting: (setting: Partial<GYTools.AppSetting>) => void

  showOpenDialog: (options: OpenDialogOptions) => Promise<OpenDialogResult>
  showSaveDialog: (options: SaveDialogOptions) => Promise<SaveDialogResult>


  /** 检查软件更新 */
  checkUpdate: () => void
  /** 下载更新 */
  downloadUpdate: () => void
  /** 重启更新 */
  restartUpdate: () => void
}>
