import fs from 'node:fs'
import { pluginState } from '../state'
import { checkAndCreateDir, joinPath, removePath } from '@/shared/nodejs'
import { downloadPlugin, loadPlugin, mvPlugin, parsePlugin, removePlugins, stopPlugin, unpackPlugin } from './shared'


/**
 * 读取已安装插件列表
 */
export const loadLocalPlugins = async() => {
  await checkAndCreateDir(pluginState.pluginDir)
  pluginState.plugins = await fs.promises.readdir(pluginState.pluginDir).then(async(fileNames) => {
    const tasks: Array<Promise<GYTools.Plugin | null>> = []
    for (const name of fileNames) {
      if (name.startsWith('.')) continue
      tasks.push(parsePlugin(joinPath(pluginState.pluginDir, name)))
    }
    return Promise.all(tasks).then(plgs => plgs.filter(Boolean) as GYTools.Plugin[])
  })
  pluginState.isLoadedPluginList = true
}

export const getLocalPlugins = async() => {
  if (!pluginState.isLoadedPluginList) await loadLocalPlugins()
  return pluginState.plugins
}


export const runPlugin = async(plugin: GYTools.Plugin) => {
  if (!plugin.isDev) {
    const targetPlugin = pluginState.plugins.find(plg => plg.name == plugin.name)
    if (!targetPlugin) throw new Error(`plugin not found: ${plugin.name}`)
    if (pluginState.runningPlugins.has(plugin.name)) throw new Error(`plugin is running: ${plugin.name}`)
    plugin = targetPlugin
  }
  await loadPlugin(plugin)
}

export const downloadAndParsePlugin = async(url: string, manifest?: GYTools.InstallManifest) => {
  const bundlePath = await downloadPlugin(url, manifest)

  const pluginPath = await unpackPlugin(bundlePath).catch(err => {
    void removePath(bundlePath)
    throw err
  })
  const plugin = await parsePlugin(pluginPath).catch(err => {
    void removePath(bundlePath)
    void removePath(pluginPath)
    throw err
  })
  if (!plugin) throw new Error('Invalid Plugin')
  void removePath(bundlePath)
  if (manifest && manifest.name != plugin.name) {
    void removePath(pluginPath)
    throw new Error('Plugin Name Not Match')
  }

  return plugin
}

export const updatePlugin = async(tempPlugin: GYTools.Plugin) => {
  const targetPluginIndex = pluginState.plugins.findIndex(plg => plg.name == tempPlugin.name)
  if (targetPluginIndex < 0) {
    void removePath(tempPlugin.directory)
    throw new Error(`Will update plugin does not exist: ${tempPlugin.name}`)
  }

  const targetPlugin = pluginState.plugins[targetPluginIndex]
  if (pluginState.runningPlugins.has(targetPlugin.name)) throw new Error(`Will update plugin does running: ${tempPlugin.name}`)

  await removePath(targetPlugin.directory)
  const pluginPath = await mvPlugin(tempPlugin.directory)
  const plugin = await parsePlugin(pluginPath)
  if (!plugin) {
    void removePath(pluginPath)
    console.error('Plugin perse failed: ', pluginPath)
    throw new Error('Plugin perse failed')
  }
  plugin.updatedTimestamp = Date.now()
  pluginState.plugins.splice(targetPluginIndex, 1, plugin)
  return plugin
}

export const installPlugin = async(tempPlugin: GYTools.Plugin) => {
  if (pluginState.plugins.some(plg => plg.name == tempPlugin.name)) {
    return updatePlugin(tempPlugin)
    // void removePath(tempPlugin.directory)
    // throw new Error(`Repeated plugin: ${tempPlugin.name}`)
  }

  const pluginPath = await mvPlugin(tempPlugin.directory)
  const plugin = await parsePlugin(pluginPath)
  if (!plugin) {
    void removePath(pluginPath)
    console.error('Plugin perse failed: ', pluginPath)
    throw new Error('Plugin perse failed')
  }

  plugin.updatedTimestamp = plugin.installedTimestamp = Date.now()
  pluginState.plugins.unshift(plugin)

  return plugin
}

export const uninstallPlugin = async(name: string) => {
  const targetPluginIndex = pluginState.plugins.findIndex(plg => plg.name == name)
  if (targetPluginIndex < 0) throw new Error(`plugin not found: ${name}`)
  const targetPlugin = pluginState.plugins[targetPluginIndex]
  await stopPlugin(targetPlugin.name)
  await removePlugins([targetPlugin])
  pluginState.plugins.splice(targetPluginIndex, 1)
}


export {
  stopPlugin,
  hidePlugin,
  showPlugin,
  parsePlugin,
  stopAllPlugins,
} from './shared'
