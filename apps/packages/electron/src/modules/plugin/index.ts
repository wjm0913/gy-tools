import { initIpcMain } from './ipc/main'
import { pluginState } from './state'
import { appState } from '@/app'
import { FILE_NAMES } from '@gy-tools/common/constants'
import { checkAndCreateDir, joinPath, removePath } from '@/shared/nodejs'
import { winMainEvent } from '@/renderer/winMain'

export const initPluginModule = () => {
  pluginState.rootDir = joinPath(appState.dataPath, FILE_NAMES.pluginDirName)
  pluginState.pluginDir = joinPath(pluginState.rootDir, FILE_NAMES.pluginDirName)
  pluginState.dataDir = joinPath(pluginState.rootDir, FILE_NAMES.pluginDataDirName)
  pluginState.tempDir = joinPath(pluginState.rootDir, FILE_NAMES.pluginTempDirName)
  checkAndCreateDir(pluginState.pluginDir)
  checkAndCreateDir(pluginState.dataDir)
  removePath(pluginState.tempDir).finally(() => {
    checkAndCreateDir(pluginState.tempDir)
  })
  winMainEvent.on('contentViewPositionChanged', (x, y, width, height) => {
    pluginState.pluginViewPosition.x = x
    pluginState.pluginViewPosition.y = y
    pluginState.pluginViewPosition.width = width
    pluginState.pluginViewPosition.height = height
    for (const plugin of pluginState.runningPlugins.values()) {
      if (!plugin.visible) continue
      plugin.view.setBounds({ x, y, width, height })
    }
  })
  initIpcMain()
}
