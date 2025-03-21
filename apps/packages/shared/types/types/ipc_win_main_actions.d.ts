// 可调用的主窗口通用方法

export declare type WinMainActions = WarpPromiseRecord<{
  /** 设置更新 */
  settingChanged: (keys: Array<keyof GYTools.AppSetting>, setting: Partial<GYTools.AppSetting>) => void
  /** 软件更新信息 */
  updateInfo: (info: GYTools.UpdateInfo) => void
}>
