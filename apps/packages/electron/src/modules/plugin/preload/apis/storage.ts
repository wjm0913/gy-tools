import { checkAndCreateDir, joinPath } from '@/shared/nodejs'
import type { Plugin_API } from '@gy-tools/types/types/plugin_api'
import fs from 'node:fs'
import { preloadState } from '../state'

export const storage: Plugin_API['storage'] = {
  async saveData(data) {
    if (typeof data != 'string') throw new Error('data must be a string')
    await checkAndCreateDir(preloadState.plugin.dataDirectory)
    await fs.promises.writeFile(joinPath(preloadState.plugin.dataDirectory, 'data'), data, 'utf8')
  },
  async getData() {
    return (await fs.promises.readFile(joinPath(preloadState.plugin.dataDirectory, 'data'), 'utf8').catch(() => {
      return ''
    })).toString()
  },
} as const
