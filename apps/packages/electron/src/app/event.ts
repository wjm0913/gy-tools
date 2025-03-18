import { EventEmitter, type EventType } from '@/shared/lib/Event'

/**
 * APP 事件
 */
export class Event extends EventEmitter {
  emitEvent<K extends keyof Omit<Event, keyof EventEmitter | 'emitEvent'>>(
    eventName: K,
    ...args: any[]
  ) {
    this.emit(eventName, ...args)
  }

  inited() {
    this.emitEvent('inited')
  }

  /**
   * 已更新的配置
   * @param keys 已更新配置的key
   * @param setting 已更新配置
   */
  updated_config(keys: Array<keyof GYTools.AppSetting>, setting: Partial<GYTools.AppSetting>) {
    this.emitEvent('updated_config', keys, setting)
  }

  /**
   * 第二例实例启动
   */
  second_instance() {
    this.emitEvent('second_instance')
  }

  activate() {
    this.emitEvent('activate')
  }

  system_theme_change(isDark: boolean) {
    this.emitEvent('system_theme_change', isDark)
  }
}

export const appEvent = new Event() as EventType<Event>
