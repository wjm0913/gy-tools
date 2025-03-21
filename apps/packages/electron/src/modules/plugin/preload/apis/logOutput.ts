import { sendLog } from '../ipc'
import type { Plugin_API } from '@gy-tools/types/types/plugin_api'

export const logOutput: Plugin_API['logOutput'] = {
  debug(...messages: any[]) {
    void sendLog('debug', messages)
  },
  info(...messages: any[]) {
    void sendLog('info', messages)
  },
  warn(...messages: any[]) {
    void sendLog('warn', messages)
  },
  error(...messages: any[]) {
    void sendLog('error', messages)
  },
} as const
