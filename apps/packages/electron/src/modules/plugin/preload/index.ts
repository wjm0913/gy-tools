import { contextBridge } from 'electron'
import { API } from './apis'
import { registerIpcRenderer } from './ipc'
import { initCustomApi } from './customApi'

void registerIpcRenderer().then(() => {
  const api = initCustomApi()
  const _api = api ? { ...API, custom: api } : API
  try {
    contextBridge.exposeInMainWorld('gyTools', _api)
    contextBridge.exposeInMainWorld('require', (name: 'gy-tools') => {
      if (name !== 'gy-tools') throw new Error('module not found: ' + name)
      return _api
    })
  } catch (error) {
    console.error(error)
  }
})
