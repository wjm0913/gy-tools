import { STORE_NAMES } from '@gy-tools/common/constants'
import getStore from '@/shared/store'
import migrateSetting from './config/migrateSetting'
import defaultSetting from '@gy-tools/common/defaultSetting'
import { appState } from './state'


const primitiveType = ['string', 'boolean', 'number']
const checkPrimitiveType = (val: any): boolean => val === null || primitiveType.includes(typeof val)
const mergeSetting = (originSetting: GYTools.AppSetting, targetSetting?: Partial<GYTools.AppSetting> | null): {
  setting: GYTools.AppSetting
  updatedSettingKeys: Array<keyof GYTools.AppSetting>
  updatedSetting: Partial<GYTools.AppSetting>
} => {
  let originSettingCopy: GYTools.AppSetting = { ...originSetting }
  // const defaultVersion = targetSettingCopy.version
  const updatedSettingKeys: Array<keyof GYTools.AppSetting> = []
  const updatedSetting: Partial<GYTools.AppSetting> = {}

  if (targetSetting) {
    const originSettingKeys = Object.keys(originSettingCopy)
    const targetSettingKeys = Object.keys(targetSetting)

    if (originSettingKeys.length > targetSettingKeys.length) {
      for (const key of targetSettingKeys as Array<keyof GYTools.AppSetting>) {
        const targetValue: any = targetSetting[key]
        const isPrimitive = checkPrimitiveType(targetValue)
        // if (checkPrimitiveType(value)) {
        if (!isPrimitive || targetValue == originSettingCopy[key] || originSettingCopy[key] === undefined) continue
        updatedSettingKeys.push(key)
        updatedSetting[key] = targetValue
        // @ts-expect-error
        originSettingCopy[key] = targetValue
        // } else {
        //   if (!isPrimitive && currentValue != undefined) handleMergeSetting(value, currentValue)
        // }
      }
    } else {
      for (const key of originSettingKeys as Array<keyof GYTools.AppSetting>) {
        const targetValue: any = targetSetting[key]
        const isPrimitive = checkPrimitiveType(targetValue)
        // if (checkPrimitiveType(value)) {
        if (!isPrimitive || targetValue == originSettingCopy[key]) continue
        updatedSettingKeys.push(key)
        updatedSetting[key] = targetValue
        // @ts-expect-error
        originSettingCopy[key] = targetValue
        // } else {
        //   if (!isPrimitive && currentValue != undefined) handleMergeSetting(value, currentValue)
        // }
      }
    }
  }

  return {
    setting: originSettingCopy,
    updatedSettingKeys,
    updatedSetting,
  }
}


export const saveSetting = (setting?: Partial<GYTools.AppSetting>, isInit: boolean = false) => {
  const electronStore_config = getStore(STORE_NAMES.APP_SETTINGS)

  let originSetting: GYTools.AppSetting
  if (isInit) {
    setting &&= migrateSetting(setting)
    originSetting = { ...defaultSetting }
  } else originSetting = appState.appSetting

  const result = mergeSetting(originSetting, setting)

  result.setting.version = defaultSetting.version

  electronStore_config.override({ version: result.setting.version, setting: result.setting })
  return result
}

/**
 * 初始化设置
 */
export const getAppSetting = async() => {
  const electronStore_config = getStore(STORE_NAMES.APP_SETTINGS)

  let setting = electronStore_config.get('setting') as GYTools.AppSetting | undefined

  // migrate setting

  // console.log(setting)
  return saveSetting(setting, true)
}
