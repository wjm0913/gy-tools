// import mitt from 'mitt'
// import type { Emitter } from 'mitt'

const nextTick = typeof queueMicrotask === 'function' ? queueMicrotask : setTimeout

export default class Event {
  listeners: Map<string, Array<(...args: any[]) => any>>
  constructor() {
    this.listeners = new Map()
  }

  on(eventName: string, listener: (...args: any[]) => any) {
    let targetListeners = this.listeners.get(eventName)
    if (!targetListeners) this.listeners.set(eventName, targetListeners = [])
    targetListeners.push(listener)
    return () => {
      this.off(eventName, listener)
    }
  }

  off(eventName: string, listener: (...args: any[]) => any) {
    let targetListeners = this.listeners.get(eventName)
    if (!targetListeners) return
    const index = targetListeners.indexOf(listener)
    if (index < 0) return
    targetListeners.splice(index, 1)
  }

  emit(eventName: string, ...args: any[]) {
    nextTick(() => {
      let targetListeners = this.listeners.get(eventName)
      if (!targetListeners) return
      for (const listener of targetListeners) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        listener(...args)
      }
    })
  }

  offAll(eventName: string) {
    let targetListeners = this.listeners.get(eventName)
    if (!targetListeners) return
    this.listeners.delete(eventName)
  }

  z_(p: any) {}
}

// 添加一个参数为 any 的 z_ 方法解决 ts 生成 on / off 类型时的性能问题

type Gtype<E extends Event> = Omit<E, keyof Event | 'emitEvent'> & { z_: (p: any) => void }
export type EventType<E extends Event> = {
  on: <K extends keyof Gtype<E>>(event: K, listener: E[K]) => () => void
  off: <K extends keyof Gtype<E>>(event: K, listener: E[K]) => void
} & Omit<Gtype<E>, 'z_'>

