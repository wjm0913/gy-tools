import { EventEmitter, type EventType } from '@/shared/lib/Event'

class Event extends EventEmitter {
  emitEvent<K extends keyof EventMethods>(eventName: K, ...args: any[]) {
    this.emit(eventName, ...args)
  }

  ready_to_show() {
    this.emitEvent('ready_to_show')
  }

  inited() {
    this.emitEvent('inited')
  }

  show() {
    this.emitEvent('show')
  }

  hide() {
    this.emitEvent('hide')
  }

  focus() {
    this.emitEvent('focus')
  }

  blur() {
    this.emitEvent('blur')
  }

  close() {
    this.emitEvent('close')
  }

  fullscreen(isFullscreen: boolean) {
    this.emitEvent('fullscreen', isFullscreen)
  }

  /** 插件显示窗口改变 */
  contentViewPositionChanged(x: number, y: number, width: number, height: number) {
    this.emitEvent('contentViewPositionChanged', x, y, width, height)
  }
}

type EventMethods = Omit<Event, keyof EventEmitter | 'emitEvent'>


export const winMainEvent = new Event() as EventType<Event>
