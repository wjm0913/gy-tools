import { app } from 'electron'
import './shared/log'
import './shared/error'
import { initAppEnv, sendInitedEvent } from '@/app'
// import registerModules from '@/modules'
import { initModules } from './modules'
import { initRenderers } from './renderer'
import { isLinux } from '@/shared/common'

let isInited = false
// 初始化应用
const init = async() => {
  console.log('init')
  await initAppEnv()
  await initModules()
  await initRenderers()

  // registerModules()
  if (app.isReady()) sendInitedEvent()
  else isInited = true
}

void app.whenReady().then(() => {
  // https://github.com/electron/electron/issues/16809
  if (isLinux) {
    setTimeout(() => {
      if (isInited) sendInitedEvent()
    }, 300)
  } else if (isInited) sendInitedEvent()
})

void init()
