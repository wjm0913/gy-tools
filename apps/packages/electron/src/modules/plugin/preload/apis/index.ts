import { env } from './env'
import { event } from './event'
import { logOutput } from './logOutput'
import { view } from './view'
import { fileSystem } from './fileSystem'
import { storage } from './storage'
import type { Plugin_API } from '@gy-tools/types/types/plugin_api'

export const API: Plugin_API = {
  env,
  event,
  logOutput,
  view,
  storage,
  fileSystem,
} as const
