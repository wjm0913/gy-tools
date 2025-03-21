import { ipcPreloadEvent } from './ipcEvent'
import type { ExposeFunctions, MainCall } from '.'

// 暴露给后端的方法
export const createExposePlugin = () => {
  return {
    async pluginListAction(event, action) {
      ipcPreloadEvent.pluginListAction(action)
    },
  } satisfies Partial<ExposeFunctions>
}


// 暴露给前端的方法
export const createClientPlugin = (main: MainCall) => {
  return {
    async setPluginViewPosition(x, y, width, height) {
      return main.setPluginViewPosition(x, y, width, height)
    },
    async getPluginList() {
      return main.getPluginList()
    },
    async stopAllPlugins() {
      return main.stopAllPlugins()
    },
    async runPlugin(plugin) {
      return main.runPlugin(plugin)
    },
    async hidePlugin(name) {
      return main.hidePlugin(name)
    },
    async stopPlugin(name) {
      return main.stopPlugin(name)
    },
    async showPlugin(name) {
      return main.showPlugin(name)
    },
    async parsePlugin(path, isDev) {
      return main.parsePlugin(path, isDev)
    },
    async installPlugin(url, name) {
      return main.installPlugin(url, name)
    },
    async updatePlugin(url, name) {
      return main.updatePlugin(url, name)
    },
    async uninstallPlugin(name) {
      return main.uninstallPlugin(name)
    },
    onPluginListAction(listener) {
      ipcPreloadEvent.on('pluginListAction', listener)
      return () => {
        ipcPreloadEvent.off('pluginListAction', listener)
      }
    },
  } satisfies Partial<GYTools.IPC.ElectronIPC>
}

