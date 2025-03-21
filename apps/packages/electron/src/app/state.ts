import defaultSetting from '@gy-tools/common/defaultSetting'


export const appState: {
  staticPath: string
  dataPath: string
  appSetting: GYTools.AppSetting
  isSkipTrayQuit: boolean
  shouldUseDarkColors: boolean
} = {
  staticPath: '',
  dataPath: '',
  appSetting: defaultSetting,
  isSkipTrayQuit: false,
  shouldUseDarkColors: false,
}
