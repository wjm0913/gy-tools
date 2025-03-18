// import { ipcPreloadEvent } from '@gy-tools/app/modules/ipcPreloadEvent'
// import type { ExposeFunctions, MainCall } from '.'
// import type { HOTKEY_Type } from '@gy-tools/common/hotKey'


// // 暴露给后端的方法
// export const createExposeHotkey = () => {
//   return {
//     async hotKeyDown(event, info) {
//       ipcPreloadEvent.hotKeyDown(info)
//     },
//     async hotKeyConfigUpdated(event, config) {
//       ipcPreloadEvent.hotKeyConfigUpdated(config as GYTools.HotKey.HotKeyConfigAll<HOTKEY_Type>)
//     },
//   } satisfies Partial<ExposeFunctions>
// }


// // 暴露给前端的方法
// export const createClientHotkey = (main: MainCall) => {
//   return {
//     getHotKey() {
//       return main.getHotKey()
//     },
//     getHotkeyStatus() {
//       return main.getHotkeyStatus()
//     },
//     hotkeyConfigAction(action) {
//       return main.hotkeyConfigAction(action)
//     },
//     onHotKeyDown(listener) {
//       ipcPreloadEvent.on('hotKeyDown', listener)
//       return () => {
//         ipcPreloadEvent.off('hotKeyDown', listener)
//       }
//     },
//     onHotKeyConfigUpdated(listener) {
//       ipcPreloadEvent.on('hotKeyConfigUpdated', listener)
//       return () => {
//         ipcPreloadEvent.off('hotKeyConfigUpdated', listener)
//       }
//     },
//   } satisfies Partial<GYTools.IPC.ServerIPC>
// }

