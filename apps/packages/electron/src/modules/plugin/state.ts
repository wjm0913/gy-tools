interface PluginInfo {
  info: GYTools.Plugin
  view: Electron.WebContentsView
  visible: boolean
}

export const pluginState = {
  rootDir: '',
  pluginDir: '',
  dataDir: '',
  tempDir: '',
  pluginViewPosition: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  /** 运行中的插件 */
  runningPlugins: new Map<string, PluginInfo>(),
  plugins: [] as GYTools.Plugin[],
  isLoadedPluginList: false,
}
