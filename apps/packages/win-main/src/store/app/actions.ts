import { onSettingChanged, onUpdateInfo, setSetting } from '@/shared/ipc/app'
import * as commit from './commit'
import { appState, type AppState } from './state'
import { stopPlugin } from '@/store/plugin/actions'

export const updateSetting = async(setting: Partial<GYTools.AppSetting>) => {
  // console.warn(setting)
  await setSetting(setting)
}

export const registerRemoteSettingAction = () => {
  return onSettingChanged((keys, setting) => {
    commit.updateSetting(keys, setting)
  })
}

export const registerRemoteUpdateInfo = () => {
  return onUpdateInfo((info) => {
    // switch (info.type) {
    //   case 'available':
    //     if (info.info.isAutoUpdate) {
    //       void message.info('发现新版本，正在尝试下载更新...')
    //     } else {
    //       confirm({
    //         title: '发现新版本，是否立即下载更新?',
    //         onOk() {
    //           checkUpdate()
    //         },
    //         onCancel() {
    //         },
    //       })
    //     }
    //     break
    //   case 'downloaded':
    //     // confirm({
    //     //   title: '新版本下载完成，是否立即重启软件安装更新?',
    //     //   onOk() {
    //     //     restartUpdate()
    //     //   },
    //     //   onCancel() {
    //     //   },
    //     // })
    //     break
    //   case 'error':
    //     // error({
    //     //   title: '自动更新失败，请手动下载更新',
    //     //   onOk() {
    //     //     // window
    //     //   },
    //     // })
    //     break

    //   default:
    //     break
    // }
    commit.setUpdateInfo(info)
  })
}

export const setView = (view: AppState['view']) => {
  const id = appState.view.pliginId
  commit.setView(view)
  setTimeout(() => {
    if (id) stopPlugin(id)
  }, 50)
}

export { getSetting } from '@/shared/ipc/app'

export { initSetting } from './commit'
