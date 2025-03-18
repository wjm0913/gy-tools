import { ipc } from './ipc'

const runningPlugins = new Map<string, GYTools.Plugin>()
let currentShowPluginName: null | string

export const setPluginViewPosition = (x: number, y: number, width: number, height: number) => {
  void ipc.setPluginViewPosition(x, y, width, height)
}


/**
 * 运行插件
 * @param plugin 插件信息
 */
export const runPlugin = async (plugin: GYTools.Plugin) => {
  if (runningPlugins.has(plugin.name)) {
    await showPlugin(plugin.name)
  } else {
    if (currentShowPluginName != null && currentShowPluginName !== plugin.name) {
      await hidePlugin(currentShowPluginName)
    }
    await ipc.runPlugin(plugin)
    runningPlugins.set(plugin.name, plugin)
    // eslint-disable-next-line require-atomic-updates
    currentShowPluginName = plugin.name
  }
}

export const parsePlugin = async (path: string, isDev?: boolean) => {
  return ipc.parsePlugin(path, isDev)
}

/**
 * 停止插件
 * @param name 插件名字
 */
export const stopPlugin = async (name: string) => {
  if (!runningPlugins.has(name)) return
  await ipc.stopPlugin(name)
  runningPlugins.delete(name)
  if (currentShowPluginName && currentShowPluginName === name) {
    currentShowPluginName = null
  }
}

export const reloadPlugin = async (name = currentShowPluginName) => {
  if (!name || !runningPlugins.has(name)) throw new Error('plugin not found')
  const plugin = runningPlugins.get(name)!
  await stopPlugin(name)
  const newPlugin = await parsePlugin(plugin.directory, plugin.isDev)
  await runPlugin(newPlugin)
  return newPlugin
}


/**
 * 停止当前前台显示插件
 * @param name 插件名字
 */
export const stopCurrentPlugin = async () => {
  if (!currentShowPluginName || !runningPlugins.has(currentShowPluginName)) return
  await ipc.stopPlugin(currentShowPluginName)
  runningPlugins.delete(currentShowPluginName)
  currentShowPluginName = null
}

/**
 * 隐藏插件
 * @param name 插件名字
 */
export const hidePlugin = async (name: string) => {
  if (!runningPlugins.has(name)) return
  await ipc.hidePlugin(name)
  if (currentShowPluginName && currentShowPluginName === name) {
    currentShowPluginName = null
  }
}

/**
 * 显示插件
 * @param name 插件名字
 */
export const showPlugin = async (name: string) => {
  if (!runningPlugins.has(name)) return
  if (currentShowPluginName && currentShowPluginName !== name) {
    await hidePlugin(currentShowPluginName)
  }
  await ipc.showPlugin(name)
  // eslint-disable-next-line require-atomic-updates
  currentShowPluginName = name
}

export const stopAllPlugins = async () => {
  await ipc.stopAllPlugins()
}


/**
 * 获取本地所有插件
 */
export const getLocalPlugins = async () => {
  const plugins = await ipc.getPluginList()
  return plugins
}
/**
 * 安装插件
 */
export const installPlugin = async (url: string, manifest?: GYTools.InstallPluginManifest) => {
  await ipc.installPlugin(url, manifest)
}
/**
 * 卸载插件
 */
export const uninstallPlugin = async (name: string) => {
  await ipc.uninstallPlugin(name)
}
/**
 * 更新插件
 */
export const updatePlugin = async (url: string, manifest?: GYTools.InstallPluginManifest) => {
  await ipc.updatePlugin(url, manifest)
}

export const onPluginListAction = (handler: (action: GYTools.IPCPlugin.ListAction) => void) => {
  return ipc.onPluginListAction(handler)
}
