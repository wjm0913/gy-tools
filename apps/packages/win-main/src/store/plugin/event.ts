import WebEvent, { type EventType } from '@/shared/Event'
import { type PluginState } from './state'

class Event extends WebEvent {
  emitEvent<K extends keyof Omit<Event, keyof WebEvent | 'emitEvent'>>(eventName: K, ...args: any[]) {
    this.emit(eventName, ...args)
  }

  pluginListChanged(plugins: PluginState['plugins']) {
    this.emitEvent('pluginListChanged', plugins)
  }

  pluginActiveChanged(plugin: GYTools.Plugin | null) {
    this.emitEvent('pluginActiveChanged', plugin)
  }
}

export const pluginEvent = new Event() as EventType<Event>

