import { winMainEvent } from '../event'
import type { ExposeFunctions } from '.'
import { downloadAndParsePlugin, getLocalPlugins, hidePlugin, installPlugin, parsePlugin, runPlugin, showPlugin, stopAllPlugins, stopPlugin, uninstallPlugin, updatePlugin } from '@/modules/plugin/manager'

// 暴露给前端的方法
export const createExposePlugin = () => {
  return {
    async setPluginViewPosition(event, x, y, width, height) {
      winMainEvent.contentViewPositionChanged(x, y, width, height)
    },
    async getPluginList() {
      return getLocalPlugins()
    },
    async stopAllPlugins() {
      return stopAllPlugins()
    },
    async runPlugin(event, plugin) {
      return runPlugin(plugin)
    },
    async hidePlugin(event, name) {
      return hidePlugin(name)
    },
    async stopPlugin(event, name) {
      return stopPlugin(name)
    },
    async showPlugin(event, name) {
      return showPlugin(name)
    },
    async parsePlugin(event, path, isDev) {
      return parsePlugin(path, isDev) as Promise<GYTools.Plugin>
    },
    async installPlugin(event, url, manifest) {
      return installPlugin(await downloadAndParsePlugin(url, manifest))
    },
    async updatePlugin(event, url, manifest) {
      return updatePlugin(await downloadAndParsePlugin(url, manifest))
    },
    async uninstallPlugin(event, name) {
      return uninstallPlugin(name)
    },
  } satisfies Partial<ExposeFunctions>
}
