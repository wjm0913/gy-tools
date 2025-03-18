import { useEffect, useState } from 'react'
import { pluginEvent } from './event'
import { pluginState, type PluginState } from './state'


export const usePluginList = () => {
  const [plugins, setPlugins] = useState<PluginState['plugins']>(pluginState.plugins)

  useEffect(() => {
    setPlugins(pluginState.plugins)
    return pluginEvent.on('pluginListChanged', setPlugins)
  }, [])

  return plugins
}

export const useActivePlugin = () => {
  const [plugin, setPlugin] = useState(pluginState.activePlugin)

  useEffect(() => {
    setPlugin(pluginState.activePlugin)
    return pluginEvent.on('pluginActiveChanged', setPlugin)
  }, [])

  return plugin
}

export const usePluginActive = (plugin: GYTools.Plugin) => {
  const [active, setActive] = useState(pluginState.activePlugin?.name == plugin.name)

  useEffect(() => {
    setActive(pluginState.activePlugin?.name == plugin.name)
    return pluginEvent.on('pluginActiveChanged', (p) => {
      setActive(p?.name == plugin.name)
    })
  }, [plugin.name])

  return active
}
