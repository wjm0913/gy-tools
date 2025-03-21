import { EventEmitter, type EventType } from '@/shared/lib/Event'
import type { LogOutput } from './ipc/type'
// import { setMainWindow } from './state';

/**
 * 插件事件
 */
export class Event extends EventEmitter {
  emitEvent<K extends keyof Omit<Event, keyof EventEmitter | 'emitEvent'>>(
    eventName: K,
    ...args: any[]
  ) {
    this.emit(eventName, ...args)
  }

  /** 插件日志输出 */
  logOutput(logInfo: LogOutput) {
    console.log(logInfo)
    this.emitEvent('logOutput', logInfo)
  }
}

export const pluginEvent = new Event() as EventType<Event>
