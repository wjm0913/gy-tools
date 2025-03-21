import { defineConfig } from 'vite'
import { buildConfig } from './build-config/vite.config'

export default defineConfig(() => {
  return buildConfig()
})
