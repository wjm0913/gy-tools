import { ipcRenderer } from 'electron'

type IpcRendererEvent = Electron.IpcRendererEvent

type IpcRendererEventListener = (event: IpcRendererEvent) => any
type IpcRendererEventListenerParams<T extends any[]> = (
  event: IpcRendererEvent,
  ...params: T
) => any

export function rendererSend(name: string): void
export function rendererSend<T extends any[]>(name: string, ...params: T): void
export function rendererSend<T extends any[]>(name: string, ...params: T): void {
  ipcRenderer.send(name, ...params)
}

export async function rendererInvoke(name: string): Promise<void>
export async function rendererInvoke<V>(name: string): Promise<V>
export async function rendererInvoke<T extends any[]>(name: string, ...params: T): Promise<void>
export async function rendererInvoke<T extends any[], V>(name: string, ...params: T): Promise<V>
export async function rendererInvoke<T extends any[], V>(name: string, ...params: T): Promise<V> {
  return ipcRenderer.invoke(name, ...params)
}

export function rendererOn(name: string, listener: IpcRendererEventListener): void
export function rendererOn<T extends any[]>(
  name: string,
  listener: IpcRendererEventListenerParams<T>,
): void
export function rendererOn<T extends any[]>(
  name: string,
  listener: IpcRendererEventListenerParams<T>,
): void {
  ipcRenderer.on(name, (event, ...params) => {
    listener(event, ...(params as T))
  })
}

export function rendererOnce(name: string, listener: IpcRendererEventListener): void
export function rendererOnce<T extends any[]>(
  name: string,
  listener: IpcRendererEventListenerParams<T>,
): void
export function rendererOnce<T extends any[]>(
  name: string,
  listener: IpcRendererEventListenerParams<T>,
): void {
  ipcRenderer.once(name, (event, ...params) => {
    listener(event, ...(params as T))
  })
}

export const rendererOff = (name: string, listener: (...args: any[]) => any) => {
  ipcRenderer.removeListener(name, listener)
}

export const rendererOffAll = (name: string) => {
  ipcRenderer.removeAllListeners(name)
}
