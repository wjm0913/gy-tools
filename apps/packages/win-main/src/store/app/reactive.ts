import { useEffect, useState } from 'react'
import { appEvent } from './event'
import { appState, type AppState } from './state'


export const useSettingValue = <T extends keyof GYTools.AppSetting>(key: T): GYTools.AppSetting[T] => {
  const [setting, setSetting] = useState(appState.appSetting[key])

  useEffect(() => {
    setSetting(appState.appSetting[key])
    return appEvent.on('setingUpdated', (keys) => {
      if (keys.includes(key)) setSetting(appState.appSetting[key])
    })
  }, [key])

  return setting
}

export const useView = () => {
  const [view, setView] = useState<AppState['view']>(appState.view)

  useEffect(() => {
    setView(appState.view)
    return appEvent.on('visibleViewChanged', setView)
  }, [])

  return view
}

export const useUpdateDownloadProgress = () => {
  const [info, setInfo] = useState({ status: appState.update.status, progress: appState.update.downloadProgress })

  useEffect(() => {
    const updateInfo = () => {
      setInfo({ status: appState.update.status, progress: appState.update.downloadProgress })
    }
    updateInfo()
    const unsub = appEvent.on('updateStatusUpdated', updateInfo)
    const unsub2 = appEvent.on('updateDownloadProgress', updateInfo)
    return () => {
      unsub()
      unsub2()
    }
  }, [])

  return info
}
