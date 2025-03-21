import WebEvent, { type EventType } from '@/shared/Event'
import { type AppState } from './state'

class Event extends WebEvent {
  emitEvent<K extends keyof Omit<Event, keyof WebEvent | 'emitEvent'>>(eventName: K, ...args: any[]) {
    this.emit(eventName, ...args)
  }

  visibleViewChanged(viewId: AppState['view']) {
    this.emitEvent('visibleViewChanged', viewId)
  }

  setingUpdated(keys: Array<keyof GYTools.AppSetting>, setting: Partial<GYTools.AppSetting>) {
    this.emitEvent('setingUpdated', keys, setting)
  }

  updateStatusUpdated(status: AppState['update']['status']) {
    this.emitEvent('updateStatusUpdated', status)
  }

  updateDownloadProgress(progress: AppState['update']['downloadProgress']) {
    this.emitEvent('updateDownloadProgress', progress)
  }
}

export const appEvent = new Event() as EventType<Event>

