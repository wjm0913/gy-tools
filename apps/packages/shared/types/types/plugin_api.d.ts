interface Event {
  /** 主题颜色已更改 */
  hasDarkColorsChanged: (hasDarkColors: boolean) => void
}

interface MessageOptions {
  type: 'none' | 'info' | 'error' | 'question' | 'warning'
  title: string
  message: string
}

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

type Platform =
  | 'aix'
  | 'android'
  | 'darwin'
  | 'freebsd'
  | 'haiku'
  | 'linux'
  | 'openbsd'
  | 'sunos'
  | 'win32'
  | 'cygwin'
  | 'netbsd'

type Arch =
  | 'arm'
  | 'arm64'
  | 'ia32'
  | 'mips'
  | 'mipsel'
  | 'ppc'
  | 'ppc64'
  | 's390'
  | 's390x'
  | 'x32'
  | 'x64'

type BufferEncoding =
  | 'ascii'
  | 'utf8'
  | 'utf-8'
  | 'utf16le'
  | 'ucs2'
  | 'ucs-2'
  | 'base64'
  | 'base64url'
  | 'latin1'
  | 'binary'
  | 'hex'

export declare interface Plugin_API {
  env: {
    version: string
    platform: Platform
    arch: Arch
    hasDarkColors: () => Promise<boolean>
  }
  event: {
    /** 监听事件 */
    on: <K extends keyof Event>(event: K, listener: Event[K]) => void
    /** 注销事件监听 */
    off: <K extends keyof Event>(event: K, listener: Event[K]) => void
    /** 监听事件（一次） */
    once: <K extends keyof Event>(event: K, listener: Event[K]) => void
  }
  logOutput: {
    debug: (...messages: any[]) => void
    info: (...messages: any[]) => void
    warn: (...messages: any[]) => void
    error: (...messages: any[]) => void
  }
  storage: {
    saveData: (data: string) => Promise<void>
    getData: () => Promise<string>
  }
  view: {
    showNotification: (title: string, message: string) => void
    showMessageBox: (options: MessageOptions) => void
    showErrorBox: (title: string, message: string) => void
  }
  fileSystem: {
    showOpenDialog: (options: OpenDialogOptions) => Promise<OpenDialogResult>
    showSaveDialog: (options: SaveDialogOptions) => Promise<SaveDialogResult>
    readFile: (
      path: string,
      encoding?: BufferEncoding,
      toEncoding?: BufferEncoding,
    ) => Promise<string>
    writeFile: (path: string, data: string, dataEncoding?: BufferEncoding) => Promise<void>
    ls: (path: string) => Promise<string[]>
    mkdir: (path: string, recursive?: boolean) => Promise<string | undefined>
    stat: (path: string) => Promise<{
      isFile: boolean
      isDirectory: boolean
      modifiedTimeMs: number
      creatTimeMs: number
      size: number
    }>
  }
}
