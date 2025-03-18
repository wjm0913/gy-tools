import path from 'node:path'
import { appState } from './state'
import { app, shell, nativeTheme } from 'electron'
import { appEvent } from './event'
import { encodePath } from '@/shared/electron'
// import { navigationUrlWhiteList } from '@common/config'

import { getAppSetting, saveSetting } from './data'
import { isMac } from '@/shared/common'
import { FILE_NAMES } from '@gy-tools/common/constants'

export const initState = () => {
  appState.shouldUseDarkColors = nativeTheme.shouldUseDarkColors

  appState.dataPath = path.join(app.getPath('userData'), FILE_NAMES.userDataDirName)

  appState.staticPath =
    process.env.NODE_ENV !== 'production'
      ? __STATIC_PATH__
      : path.join(encodePath(__dirname), '../static')
}

export const initSingleInstanceHandle = () => {
  // 单例应用程序
  if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
  }

  app.on('second-instance', (event, argv, cwd) => {
    appEvent.second_instance()
  })
}

export const listenerAppEvent = () => {
  app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('navigation to url:', navigationUrl.length > 130 ? navigationUrl.substring(0, 130) + '...' : navigationUrl)
        return
      }
      // if (!navigationUrlWhiteList.some(url => url.test(navigationUrl))) {
      event.preventDefault()
      //   return
      // }
      console.log('navigation to url:', navigationUrl)
    })
    contents.setWindowOpenHandler(({ url }) => {
      if (!/^devtools/.test(url) && /^https?:\/\//.test(url)) {
        void shell.openExternal(url)
      }
      console.log(url)
      return { action: 'deny' }
    })
    contents.on('will-attach-webview', (event, webPreferences, params) => {
      // Strip away preload scripts if unused or verify their location is legitimate
      delete webPreferences.preload
      // delete webPreferences.preloadURL

      // Disable Node.js integration
      webPreferences.nodeIntegration = false

      // Verify URL being loaded
      // if (!navigationUrlWhiteList.some(url => url.test(params.src))) {
      event.preventDefault()
      // }
    })

    // disable create dictionary
    // https://github.com/lyswhut/lx-music-desktop/issues/773
    contents.session.setSpellCheckerDictionaryDownloadURL('http://0.0.0.0')
  })

  app.on('activate', () => {
    appEvent.activate()
  })

  app.on('window-all-closed', () => {
    if (isMac) return

    app.quit()
  })


  appState.shouldUseDarkColors = nativeTheme.shouldUseDarkColors
  nativeTheme.addListener('updated', () => {
    const shouldUseDarkColors = nativeTheme.shouldUseDarkColors
    if (appState.shouldUseDarkColors == shouldUseDarkColors) return
    appState.shouldUseDarkColors = shouldUseDarkColors
    appEvent.system_theme_change(shouldUseDarkColors)
  })
}

export const initAppEnv = async() => {
  initState()
  initSingleInstanceHandle()
  listenerAppEvent()
  appState.appSetting = (await getAppSetting()).setting
}

/**
 * 更新配置
 * @param setting 新设置
 */
export const updateSetting = (setting: Partial<GYTools.AppSetting>) => {
  const { setting: newSetting, updatedSettingKeys, updatedSetting } = saveSetting(setting)
  appState.appSetting = newSetting
  if (!updatedSettingKeys.length) return
  appEvent.updated_config(updatedSettingKeys, updatedSetting)
}

export const sendInitedEvent = () => {
  appEvent.inited()
}

export * as appActions from './actions'
export { appState } from './state'
export { appEvent } from './event'
