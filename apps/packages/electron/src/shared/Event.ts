import { EventEmitter as _EventEmitter } from 'node:events';

export class EventEmitter extends _EventEmitter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  z_(p: any) {}
}

// 添加一个参数为 any 的 z_ 方法解决 ts 生成 on / off 类型时的性能问题

type Gtype<E extends EventEmitter> = Omit<E, keyof EventEmitter | 'emitEvent'> & {
  z_: (p: any) => void;
};
export type EventType<E extends EventEmitter> = {
  on: <K extends keyof Gtype<E>>(event: K, listener: E[K]) => void;
  once: <K extends keyof Gtype<E>>(event: K, listener: E[K]) => void;
  off: <K extends keyof Gtype<E>>(event: K, listener: E[K]) => void;
} & Omit<Gtype<E>, 'z_'>;
