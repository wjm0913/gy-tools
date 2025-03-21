import { preloadState } from './state'

export const initCustomApi = () => {
  if (preloadState.plugin.customApi) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const api = require(preloadState.plugin.customApi) as Record<string, unknown>
      return typeof api == 'object' ? { ...api } : undefined
    } catch (err) {
      console.log(err)
    }
  }
  return undefined
}
