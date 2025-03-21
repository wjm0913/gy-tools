import type { ElectronActions as _ElectronActions } from './ipc_electron_actions'
import type { WinMainActions as _WinMainActions } from './ipc_win_main_actions'
import './ipc_plugin'

// type ExcludeSendActions<Actions extends Record<string, any>> = Pick<Actions, {
//   [K in keyof Actions]: K extends `send${string}` ? never : K
// }[keyof Actions]>
// type PickSendActions<Actions extends Record<string, any>> = Pick<Actions, {
//   [K in keyof Actions]: K extends `send${string}` ? K : never
// }[keyof Actions]>
type WarpOnActions<Actions extends Record<string, (...args: any[]) => any>> = {
  [K in keyof Actions as `on${Capitalize<string & K>}`]: (handler: (...args: Parameters<Actions[K]>) => void) => () => void
}
// type RenameSend2On<T> = {
//   [K in keyof T as K extends `send${infer R}` ? `on${R}` : K]: T[K];
// }
// type WarpSendActions<Actions extends Record<string, (...args: any[]) => any>> = WarpOnActions<PickSendActions<Actions>>

type WinMainAllActions = GYTools.IPC.WinMainActions
& GYTools.IPCPlugin.ClientActions

type ElectronAllActions = GYTools.IPC.ElectronActions
& GYTools.IPCPlugin.ElectronActions

declare global {
  namespace GYTools {
    namespace IPC {
      type WarpIPCHandlerActions<Socket, Actions extends Record<string, (...args: any[]) => Promise<any>>> = {
        [K in keyof Actions]: Socket extends undefined ? Actions[K] : (...args: [Socket, ...Parameters<Actions[K]>]) => ReturnType<Actions[K]>
      }

      type ConnectIPCSrivice = (onConnected: (ipc: GYTools.IPC.ElectronIPC) => void,
        onDisconnected: () => void,
        onFailed: (message: string) => void,
        onLogout: () => void,
        pwd: string
      ) => void
      type WinType = 'main'
      type ElectronActions = _ElectronActions
      type WinMainActions = _WinMainActions

      type WinMainIPCActions<Socket = undefined> = WarpIPCHandlerActions<Socket, WinMainAllActions>

      type ElectronIPCActions<Socket = undefined> = WarpIPCHandlerActions<Socket, ElectronAllActions>

      type WinMainIPC = WinMainAllActions
      type ElectronIPC = ElectronAllActions & WarpOnActions<WinMainAllActions>
    }
  }
}

// export {}
