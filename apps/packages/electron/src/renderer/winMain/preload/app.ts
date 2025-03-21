import { ipcPreloadEvent } from './ipcEvent'
import type { ExposeFunctions, MainCall } from '.'

// 暴露给后端的方法
export const createExposeApp = () => {
  return {
    async settingChanged(event, keys, setting) {
      ipcPreloadEvent.settingChanged(keys, setting)
    },
    async updateInfo(event, info) {
      ipcPreloadEvent.updateInfo(info)
    },
  } satisfies Partial<ExposeFunctions>
}


// 暴露给前端的方法
export const createClientApp = (main: MainCall) => {
  return {
    async getSetting() {
      return main.getSetting()
    },
    async setSetting(setting) {
      return main.setSetting(setting)
    },
    onSettingChanged(listener) {
      ipcPreloadEvent.on('settingChanged', listener)
      return () => {
        ipcPreloadEvent.off('settingChanged', listener)
      }
    },
    async inited() {
      return main.inited()
    },
    async minWindow() {
      return main.minWindow()
    },
    async closeWindow(isForce) {
      return main.closeWindow(isForce)
    },
    async showOpenDialog(options) {
      return main.showOpenDialog(options)
    },
    async showSaveDialog(options) {
      return main.showSaveDialog(options)
    },
    async checkUpdate() {
      return main.checkUpdate()
    },
    async downloadUpdate() {
      return main.downloadUpdate()
    },
    async restartUpdate() {
      return main.restartUpdate()
    },
    onUpdateInfo(listener) {
      ipcPreloadEvent.on('updateInfo', listener)
      return () => {
        ipcPreloadEvent.off('updateInfo', listener)
      }
    },
  } satisfies Partial<GYTools.IPC.ElectronIPC>
}

