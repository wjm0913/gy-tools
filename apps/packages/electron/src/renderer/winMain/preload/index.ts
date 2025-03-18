import { createMainCall } from '@/shared/ipc/renderer'
import { createClientApp, createExposeApp } from './app'
import { IPC_NAMES } from '@/shared/ipc/names'
import { createClientPlugin, createExposePlugin } from './plugin'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

export type ExposeFunctions = GYTools.IPC.WinMainIPCActions<Electron.IpcRendererEvent>
export type MainCall = typeof mainCall

const exposeObj: ExposeFunctions = {
  ...createExposeApp(),
  ...createExposePlugin(),
}

const mainCallUtil = createMainCall<GYTools.IPC.ElectronIPC>(IPC_NAMES.WIN_MAIN, exposeObj)
const mainCall = mainCallUtil.remote
console.log('preload')

const ipc: GYTools.IPC.ElectronIPC = {
  ...createClientApp(mainCall),
  ...createClientPlugin(mainCall),
}

// @ts-expect-error
window.__gy_ipc__ = ipc
