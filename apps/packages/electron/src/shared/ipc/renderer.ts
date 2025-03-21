import { ipcRenderer } from 'electron'

type FuncsTools = typeof funcsTools
const funcsTools = {
  namespaceName: '',
  handlers: new Map<string, (...params: any[]) => void>(),
  init(namespace: string, exposeObj: Record<string, any>) {
    this.namespaceName = namespace
    for (const [funcName, func] of Object.entries(exposeObj)) {
      const handler = (...params: any[]) => {
        func(...params)
      }
      const name = this.createKey(funcName)
      this.handlers.set(name, handler)
      ipcRenderer.on(name, handler)
    }
  },
  createKey(funcName: string) {
    return `${this.namespaceName}${funcName}`
  },
  async getData(funcName: string, args: any[]) {
    return ipcRenderer.invoke(this.createKey(funcName), ...args)
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
        return context.getData(path!, argumentsList)
      },

      // deleteProperty
    }) as T

    return proxy
  },
  destroy() {
    for (const [name, handler] of this.handlers.entries()) {
      ipcRenderer.off(name, handler)
    }
    this.handlers.clear()
  },
}
export const createMainCall = <T>(namespace: string, exposeObj: Record<string, any>) => {
  const tools = Object.create(funcsTools) as FuncsTools
  tools.init(namespace, exposeObj)

  return {
    remote: tools.createProxy<T>(tools),
    destroy: tools.destroy.bind(tools),
  }
}
