declare global {
  namespace GYTools {
    interface AppSetting {
      version: string

      /** 启动时显示扩展市场界面 */
      'common.startupShowPluginView': boolean

      /** 侧栏折叠状态 */
      'common.asideCollapsed': boolean

      /** 尝试自动更新 */
      'common.tryAutoUpdate': boolean

      /** 是否启用托盘 */
      // 'tray.enable': boolean
    }
  }

}

export {}
