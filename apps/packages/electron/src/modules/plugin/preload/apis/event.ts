import { EventEmitter } from '@/shared/Event'
import type { Plugin_API } from '@gy-tools/types/types/plugin_api'

/**
 * 主窗口事件
 */
export class Event extends EventEmitter {
  emitEvent<K extends keyof Omit<Event, keyof EventEmitter | 'emitEvent'>>(
    eventName: K,
    ...args: any[]
  ) {
    this.emit(eventName, ...args)
  }

  /** 主题颜色已更改 */
  hasDarkColorsChanged(hasDarkColors: boolean) {
    this.emitEvent('hasDarkColorsChanged', hasDarkColors)
  }
}

type Gtype<E extends EventEmitter> = Omit<E, keyof EventEmitter | 'emitEvent'>
type EventType<E extends EventEmitter> = {
  on: <K extends keyof Gtype<E>>(event: K, listener: E[K]) => void
  once: <K extends keyof Gtype<E>>(event: K, listener: E[K]) => void
  off: <K extends keyof Gtype<E>>(event: K, listener: E[K]) => void
} & Gtype<E>
type ApiEventType = EventType<Event>

export const apiEvent = new Event() as ApiEventType

export const event: Plugin_API['event'] = {
  on(name, handler) {
    apiEvent.on(name, handler)
  },
  off(name, handler) {
    apiEvent.off(name, handler)
  },
  once(name, handler) {
    apiEvent.on(name, handler)
  },
}
