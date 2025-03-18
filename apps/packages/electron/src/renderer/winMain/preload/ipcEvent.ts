// 前端 preload 事件处理层
import Event, { type EventType } from '@/shared/lib/WebEvent'

class IPCEvent extends Event {
  emitEvent<K extends keyof EventMethods>(eventName: K, ...args: any[]) {
    this.emit(eventName, ...args)
  }

  settingChanged(keys: Array<keyof GYTools.AppSetting>, setting: Partial<GYTools.AppSetting>) {
    this.emitEvent('settingChanged', keys, setting)
  }

  pluginListAction(action: GYTools.IPCPlugin.ListAction) {
    this.emitEvent('pluginListAction', action)
  }

  updateInfo(info: GYTools.UpdateInfo) {
    this.emitEvent('updateInfo', info)
  }
}

type EventMethods = Omit<IPCEvent, keyof Event | 'emitEvent'>

export const ipcPreloadEvent = new IPCEvent() as EventType<IPCEvent>

