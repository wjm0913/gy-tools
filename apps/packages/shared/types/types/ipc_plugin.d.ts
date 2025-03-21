
declare namespace GYTools {
  namespace IPCPlugin {
    type ListActionSet = GYTools.Plugin[]
    interface ListActionAdd {
      plugins: GYTools.Plugin[]
      pos: number
    }
    type ListActionUpdate = GYTools.Plugin
    type ListActionRemove = string[]
    interface ListActionMove {
      id: string | null
      ids: string[]
      position: number
    }
    interface ListActionPosUpdate {
      musics: string[]
      pos: number
    }

    type ListAction = IPCAction<'set', ListActionSet>
    | IPCAction<'add', ListActionAdd>
    | IPCAction<'remove', ListActionRemove>
    | IPCAction<'update', ListActionUpdate>
    | IPCAction<'move', ListActionMove>
    | IPCAction<'posUpdate', ListActionPosUpdate>

    type ElectronActions = WarpPromiseRecord<{
      getPluginList: () => GYTools.Plugin[]
      setPluginViewPosition: (x: number, y: number, width: number, height: number) => void
      runPlugin: (plugin: GYTools.Plugin) => void
      stopAllPlugins: () => void
      parsePlugin: (path: string, isDev?: boolean) => GYTools.Plugin
      hidePlugin: (name: string) => void
      stopPlugin: (name: string) => void
      showPlugin: (name: string) => void
      installPlugin: (url: string, manifest?: GYTools.InstallPluginManifest) => GYTools.Plugin
      updatePlugin: (url: string, manifest?: GYTools.InstallPluginManifest) => GYTools.Plugin
      uninstallPlugin: (name: string) => void
    }>
    type ServerIPCActions<Socket = undefined> = GYTools.IPC.WarpIPCHandlerActions<Socket, ElectronActions>


    type ClientActions = WarpPromiseRecord<{
      pluginListAction: (action: GYTools.IPCPlugin.ListAction) => void
    }>
    type ClientIPCActions<Socket = undefined> = GYTools.IPC.WarpIPCHandlerActions<Socket, ClientActions>
  }
}
