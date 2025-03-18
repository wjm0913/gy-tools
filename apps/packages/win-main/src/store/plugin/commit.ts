import { pluginEvent } from './event'
import { type PluginState, pluginState } from './state'


export const setPluginList = (list: PluginState['plugins']) => {
  pluginState.plugins = list
  pluginEvent.pluginListChanged(list)
}

export const setActivePlugin = (plugin: GYTools.Plugin | null) => {
  pluginState.activePlugin = plugin
  pluginEvent.pluginActiveChanged(plugin)
}

