import defaultSetting from '@gy-tools/common/defaultSetting'
import type { ViewId } from '@/views'

export interface AppState {
  appSetting: GYTools.AppSetting
  view: {
    id: ViewId
    title: string
    pliginId?: string
    showReload?: boolean
  }
  update: {
    latest: boolean
    version: string
    status: 'downloaded' | 'downloading' | 'error' | 'checking' | 'idle'
    downloadProgress: Extract<GYTools.UpdateInfo, { type: 'download-progress' }>['info'] | null
  }
}

export const appState: AppState = {
  appSetting: defaultSetting,
  view: {
    id: 'Welcome',
    title: '欢迎',
  },
  update: {
    latest: false,
    version: '',
    status: 'idle',
    downloadProgress: null,
  },
}
