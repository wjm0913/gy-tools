// import { compareVer } from './index'


export default (setting: Record<string, any>): Partial<GYTools.AppSetting> => {
  setting = { ...setting }

  return setting
}
