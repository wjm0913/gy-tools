export const DEV_SERVER_PORTS = {
  'win-main': 9200,
} as const

export const STORE_NAMES = {
  APP_SETTINGS: 'config',
} as const

export const FILE_NAMES = {
  userDataDirName: 'gytools_data',
  pluginDirName: 'plugins',
  pluginDataDirName: 'datas',
  pluginTempDirName: 'temp',
  pluginMainifestName: 'mainifest.json',
  pluginBundleExtName: 'gytp',
} as const
