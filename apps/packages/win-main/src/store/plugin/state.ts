export interface PluginState {
  activePlugin: GYTools.Plugin | null
  plugins: GYTools.Plugin[]
}

export const pluginState: PluginState = {
  activePlugin: null,
  plugins: [],
}
