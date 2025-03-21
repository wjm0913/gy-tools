import type { MessageOptions } from '../../ipc/type'
import { sendNotification, sendMessageBox, sendErrorBox } from '../ipc'
import type { Plugin_API } from '@gy-tools/types/types/plugin_api'

export const view: Plugin_API['view'] = {
  /** 显示通知 */
  showNotification(title: string, message: string) {
    sendNotification(title, message)
  },
  /** 消息弹窗 */
  showMessageBox(options: MessageOptions) {
    sendMessageBox(options)
  },
  /** 错误弹窗 */
  showErrorBox(title: string, message: string) {
    sendErrorBox(title, message)
  },
} as const
