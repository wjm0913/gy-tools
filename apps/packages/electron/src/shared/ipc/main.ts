import { ipcMain } from 'electron'

type FuncsTools = typeof funcsTools
const funcsTools = {
  namespaceName: '',
  sendEvent: (...args: any[]) => {},
  handlers: new Set<string>(),
  init(namespace: string, exposeObj: Record<string, any>, sendEvent: (...args: any[]) => void) {
    this.namespaceName = namespace
    this.sendEvent = sendEvent
    this.namespaceName = namespace

    for (const [funcName, func] of Object.entries(exposeObj)) {
      const name = this.createKey(funcName)
      this.handlers.add(name)
      ipcMain.handle(name, func)
    }
  },
  createKey(funcName: string) {
    return `${this.namespaceName}${funcName}`
  },
  getData(funcName: string, args: any[]) {
    this.sendEvent(this.createKey(funcName), ...args)
  },
  createProxy<T>(context: typeof this, path?: string) {
    const proxy = new Proxy(function() {}, {
      get: (_target, prop, receiver) => {
        let propName = prop.toString()
        // console.log('get prop name', propName, path)
        return context.createProxy(context, propName)
      },
      // eslint-disable-next-line @typescript-eslint/promise-function-async
      apply: (target, thisArg, argumentsList) => {
        context.getData(path!, argumentsList)
      },

      // deleteProperty
    }) as T

    return proxy
  },
  destroy() {
    for (const name of this.handlers.values()) {
      ipcMain.removeHandler(name)
    }
    this.handlers.clear()
  },
}
export const createRendererCall = <T>(namespace: string, exposeTypeObj: Record<string, any>, sendEvent: (...args: any[]) => void) => {
  const tools = Object.create(funcsTools) as FuncsTools
  tools.init(namespace, exposeTypeObj, sendEvent)

  return {
    remote: tools.createProxy<T>(tools),
    destroy: tools.destroy.bind(tools),
  }
}
