import { ipc } from './ipc'


export const getSetting = async() => {
  return ipc.getSetting()
}

export const setSetting: GYTools.IPC.ElectronIPC['setSetting'] = async(setting) => {
  await ipc.setSetting(setting)
}

export const onSettingChanged: GYTools.IPC.ElectronIPC['onSettingChanged'] = (listener) => {
  return ipc.onSettingChanged(listener)
}

export const showOpenDialog: GYTools.IPC.ElectronIPC['showOpenDialog'] = async(options) => {
  return ipc.showOpenDialog(options)
}

export const showSaveDialog: GYTools.IPC.ElectronIPC['showSaveDialog'] = async(options) => {
  return ipc.showSaveDialog(options)
}

export const onUpdateInfo: GYTools.IPC.ElectronIPC['onUpdateInfo'] = (listener) => {
  return ipc.onUpdateInfo(listener)
}

export const checkUpdate: GYTools.IPC.ElectronIPC['checkUpdate'] = async() => {
  return ipc.checkUpdate()
}

export const downloadUpdate: GYTools.IPC.ElectronIPC['downloadUpdate'] = async() => {
  return ipc.downloadUpdate()
}

export const restartUpdate: GYTools.IPC.ElectronIPC['restartUpdate'] = async() => {
  return ipc.restartUpdate()
}
