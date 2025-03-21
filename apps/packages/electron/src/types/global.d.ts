import '@gy-tools/types'
import type { Plugin as _Plugin, Manifest, InstallManifest as _InstallManifest } from '@gy-tools/types/types/plugin'

declare global {
  namespace GYTools {
    type Plugin = _Plugin
    type PluginManifest = Manifest
    type InstallManifest = _InstallManifest
  }

  interface EnvParams {
    // cmdParams: CmdParams
    workAreaSize?: Electron.Size
  }

  const __STATIC_PATH__: string
}

