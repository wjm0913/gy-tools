import { getLocalPlugins, installPlugin, runPlugin, uninstallPlugin, updatePlugin as _updatePlugin, parsePlugin, reloadPlugin, stopPlugin as _stopPlugin, stopAllPlugins as _stopAllPlugins } from '@/shared/ipc/plugin'
import { setView } from '@/store/app/commit'
import * as commit from './commit'
import { message } from 'antd'

export { setPluginList } from './commit'

export { getLocalPlugins } from '@/shared/ipc/plugin'

export const runAndShowPlugin = async(plugin: GYTools.Plugin) => {
  setView({
    id: 'Plugin',
    title: plugin.displayName,
    pliginId: plugin.name,
    showReload: plugin.isDev,
  })
  commit.setActivePlugin(plugin)
  await runPlugin(plugin)
}


export const removePlugin = async(name: string) => {
  await uninstallPlugin(name).then(() => {
    void message.success('卸载成功')
  }).catch((err) => {
    void message.error('卸载失败：' + err.message)
  })
  const list = await getLocalPlugins()
  commit.setPluginList(list)
}

export const addPlugin = async(url: string, manifest?: GYTools.InstallPluginManifest) => {
  await installPlugin(url, manifest).then(() => {
    void message.success('安装成功')
  }).catch((err) => {
    void message.error('安装失败：' + err.message)
  })
  const list = await getLocalPlugins()
  commit.setPluginList(list)
}

export const updatePlugin = async(url: string, manifest?: GYTools.InstallPluginManifest) => {
  await _updatePlugin(url, manifest).then(() => {
    void message.success('更新成功')
  }).catch((err) => {
    void message.error('更新失败：' + err.message)
  })
  const list = await getLocalPlugins()
  commit.setPluginList(list)
}

export const parseDevPlugin = async(path: string) => {
  return parsePlugin(path, true).catch((err) => {
    void message.error('解释失败：' + err.message)
    throw err
  })
}

export const stopPlugin = async(name: string) => {
  console.log('stopPlugin')
  await _stopPlugin(name).catch((err) => {
    void message.error('停止失败：' + err.message)
    throw err
  })
  commit.setActivePlugin(null)
}

export const reloadCurrentPlugin = async() => {
  const plugin = await reloadPlugin().catch((err) => {
    void message.error('重新加载失败：' + err.message)
    throw err
  })
  setView({
    id: 'Plugin',
    title: plugin.displayName,
    pliginId: plugin.name,
    showReload: plugin.isDev,
  })
}

export const stopAllPlugins = async() => {
  await _stopAllPlugins()
  commit.setActivePlugin(null)
}
