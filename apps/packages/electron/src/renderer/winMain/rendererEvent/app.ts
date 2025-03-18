import { app } from 'electron'
import {
  minimize,
  closeWindow,
} from '../main'
import { appState, updateSetting } from '@/app'
import { winMainEvent } from '../event'
import type { ExposeFunctions } from '.'
import { winMainState } from '../state'
import { showOpenDialog, showSaveDialog } from '@/shared/electron'
import { checkUpdate, downloadUpdate, restartUpdate } from '../autoUpdate'

// 暴露给前端的方法
export const createExposeApp = () => {
  return {
    async getSetting(event) {
      return appState.appSetting
    },
    async setSetting(event, setting) {
      updateSetting(setting)
    },
    async inited() {
      winMainEvent.inited()
    },
    async minWindow() {
      minimize()
    },
    async closeWindow(event, isForce) {
      if (isForce) {
        app.exit(0)
        return
      }
      closeWindow()
    },
    async showOpenDialog(event, opts) {
      if (!winMainState.browserWindow) throw new Error('mainWindow not defined')
      const ret = await showOpenDialog(winMainState.browserWindow, {
        title: opts.title,
        defaultPath: opts.defaultPath,
        buttonLabel: opts.buttonLabel,
        filters: opts.filters,
        properties: opts.properties,
      })
      return {
        canceled: ret.canceled,
        filePaths: ret.filePaths,
      }
    },
    async showSaveDialog(event, opts) {
      if (!winMainState.browserWindow) throw new Error('mainWindow not defined')
      const ret = await showSaveDialog(winMainState.browserWindow, {
        title: opts.title,
        defaultPath: opts.defaultPath,
        buttonLabel: opts.buttonLabel,
        filters: opts.filters,
        properties: opts.properties,
      })
      return {
        canceled: ret.canceled,
        filePath: ret.filePath,
      }
    },
    async checkUpdate(event) {
      checkUpdate()
    },
    async downloadUpdate(event) {
      void downloadUpdate()
    },
    async restartUpdate(event) {
      restartUpdate()
    },
  } satisfies Partial<ExposeFunctions>
}
