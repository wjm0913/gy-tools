import { createRendererCall } from '@/shared/ipc/main'
import { IPC_NAMES } from '@/shared/ipc/names'
import { createExposeApp } from './app'
import { createExposePlugin } from './plugin'
// import { createExposeHotkey } from './hotKey'


export type ExposeFunctions = GYTools.IPC.ElectronIPCActions<Electron.IpcRendererEvent>

let isInitialized = false
let ipc: GYTools.IPC.WinMainIPC
export const init = (sendEvent: (...args: any[]) => void) => {
  if (isInitialized) return
  isInitialized = true


  const exposeObj: ExposeFunctions = {
    ...createExposeApp(),
    ...createExposePlugin(),
    // ...createExposeHotkey(),
  }

  const rendererCallUtil = createRendererCall<GYTools.IPC.WinMainIPC>(IPC_NAMES.WIN_MAIN, exposeObj, sendEvent)

  ipc = rendererCallUtil.remote
}

const _ipc = new Proxy({}, {
  get(target, property, receiver) {
    return ipc[property as keyof GYTools.IPC.WinMainIPC]
  },
}) as GYTools.IPC.WinMainIPC


export {
  _ipc as rendererIPC,
}
