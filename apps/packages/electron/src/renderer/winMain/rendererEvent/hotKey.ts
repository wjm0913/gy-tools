// import { getHotKeyConfig, getHotkeyStatus, handleHotkeyConfigAction } from '@/modules/hotKey'
// import type { ExposeFunctions } from '.'
// import type { HOTKEY_Type } from '@gy-tools/common/hotKey'


// // 暴露给前端的方法
// export const createExposeHotkey = () => {
//   return {
//     async getHotKey(event) {
//       return getHotKeyConfig()
//     },
//     async getHotkeyStatus(event) {
//       return getHotkeyStatus()
//     },
//     async hotkeyConfigAction(event, action) {
//       return handleHotkeyConfigAction(action as GYTools.HotKey.HotKeyActions<HOTKEY_Type>)
//     },
//   } satisfies Partial<ExposeFunctions>
// }
