import { appEvent } from './event'
import { type AppState, appState } from './state'


export const initSetting = (newSetting: GYTools.AppSetting) => {
  appState.appSetting = newSetting
  appEvent.setingUpdated(Object.keys(newSetting) as Array<keyof GYTools.AppSetting>, newSetting)
}

const mergeSetting = (newSetting: Partial<GYTools.AppSetting>) => {
  for (const [key, value] of Object.entries(newSetting)) {
    // @ts-expect-error
    appState.appSetting[key] = value
  }
}
export const updateSetting = (keys: Array<keyof GYTools.AppSetting>, setting: Partial<GYTools.AppSetting>) => {
  mergeSetting(setting)
  appEvent.setingUpdated(keys, setting)
}

export const setView = (view: AppState['view']) => {
  appState.view = view
  appEvent.visibleViewChanged(view)
}

export const setUpdateInfo = (info: GYTools.UpdateInfo) => {
  switch (info.type) {
    case 'available':
      appState.update.latest = false
      appState.update.status = 'idle'
      appEvent.updateStatusUpdated('idle')
      break
    case 'downloaded':
      appState.update.status = 'downloaded'
      appEvent.updateStatusUpdated('downloaded')
      break
    case 'download-progress':
      if (appState.update.status != 'downloading') {
        appState.update.status = 'downloading'
        appEvent.updateStatusUpdated('downloading')
      }
      appState.update.downloadProgress = info.info
      appEvent.updateDownloadProgress(info.info)
      break
    case 'checking':
      appState.update.latest = false
      appEvent.updateStatusUpdated('checking')
      break
    case 'not-available':
      appState.update.latest = true
      appState.update.status = 'idle'
      appEvent.updateStatusUpdated('idle')
      break
    case 'error':
      appEvent.updateStatusUpdated('error')
      break

    default:
      break
  }
}

