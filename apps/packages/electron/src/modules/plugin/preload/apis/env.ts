import { hasDarkColors } from '../ipc'
import { preloadState } from '../state'
import type { Plugin_API } from '@gy-tools/types/types/plugin_api'

export const env: Plugin_API['env'] = {
  /** 扩展系统版本号 */
  get version() {
    return preloadState.plugin.version
  },
  /** 运行平台 */
  platform: process.platform,
  /** 架构 */
  arch: process.arch as Plugin_API['env']['arch'],
  /** 是否暗色主题 */
  hasDarkColors,
  /** 语言 */
  // locale,
} as const
