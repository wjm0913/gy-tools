import { init as initRendererEvent, rendererIPC } from './rendererEvent'
import { createWindow, getWebContents, isExistWindow, showWindow } from './main'
import { appEvent } from '@/app'
import { actions } from '@/actions'
import { isMac } from '@/shared/common'
import { winMainEvent } from './event'
import { checkUpdate, initUpdate } from './autoUpdate'


export const initWinMain = () => {
  initRendererEvent((name: string, ...args) => {
    getWebContents().send(name, ...args)
  })
  initUpdate()

  appEvent.on('updated_config', (keys, setting) => {
    void rendererIPC.settingChanged(keys, setting)
  })
  appEvent.on('inited', createWindow)
  appEvent.on('second_instance', () => {
    if (isExistWindow()) {
      showWindow()
    } else {
      if (isMac) createWindow()
      else actions.exec('app.quit')
    }
  })
  appEvent.on('activate', () => {
    if (isExistWindow()) {
      showWindow()
    } else {
      createWindow()
    }
  })
  // if (process.env.NODE_ENV === 'production') {
  winMainEvent.on('ready_to_show', () => {
    checkUpdate()
  })
  // }
}
