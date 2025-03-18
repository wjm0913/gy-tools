import { ipcMain } from 'electron';
type IpcMainEvent = Electron.IpcMainEvent;
type IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;

type IpcMainEventListener = (event: IpcMainEvent) => void;
type IpcMainEventListenerParams<T extends any[]> = (event: IpcMainEvent, ...params: T) => void;

type IpcMainInvokeEventListener = (event: IpcMainInvokeEvent) => Promise<void>;
type IpcMainInvokeEventListenerParams<T extends any[]> = (
  event: IpcMainInvokeEvent,
  ...params: T
) => Promise<void>;
type IpcMainInvokeEventListenerValue<V> = (event: IpcMainInvokeEvent) => Promise<V>;
type IpcMainInvokeEventListenerParamsValue<T extends any[], V> = (
  event: IpcMainInvokeEvent,
  ...params: T
) => Promise<V>;

export function mainOn(name: string, listener: IpcMainEventListener): void;
export function mainOn<T extends any[]>(
  name: string,
  listener: IpcMainEventListenerParams<T>,
): void;
export function mainOn<T extends any[]>(
  name: string,
  listener: IpcMainEventListenerParams<T>,
): void {
  ipcMain.on(name, (event, ...params) => {
    listener(event, ...(params as T));
  });
}

export function mainOnce(name: string, listener: IpcMainEventListener): void;
export function mainOnce<T extends any[]>(
  name: string,
  listener: IpcMainEventListenerParams<T>,
): void;
export function mainOnce<T extends any[]>(
  name: string,
  listener: IpcMainEventListenerParams<T>,
): void {
  ipcMain.once(name, (event, ...params) => {
    listener(event, ...(params as T));
  });
}

export const mainOff = (name: string, listener: (...args: any[]) => void) => {
  ipcMain.removeListener(name, listener);
};

export function mainHandle(name: string, listener: IpcMainInvokeEventListener): void;
export function mainHandle<T extends any[]>(
  name: string,
  listener: IpcMainInvokeEventListenerParams<T>,
): void;
export function mainHandle<V>(name: string, listener: IpcMainInvokeEventListenerValue<V>): void;
export function mainHandle<T extends any[], V>(
  name: string,
  listener: IpcMainInvokeEventListenerParamsValue<T, V>,
): void;
export function mainHandle<T extends any[], V>(
  name: string,
  listener: IpcMainInvokeEventListenerParamsValue<T, V>,
): void {
  ipcMain.handle(name, async (event, ...params) => {
    return listener(event, ...(params as T));
  });
}

export function mainSend(webContents: Electron.WebContents, name: string): void;
export function mainSend<T extends any[]>(
  webContents: Electron.WebContents,
  name: string,
  ...params: T
): void;
export function mainSend<T extends any[]>(
  webContents: Electron.WebContents,
  name: string,
  ...params: T
): void {
  webContents.send(name, ...params);
}
