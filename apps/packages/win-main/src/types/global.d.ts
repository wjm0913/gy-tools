import '@gy-tools/types'
import type { Plugin as _Plugin, Manifest, InstallManifest } from '@gy-tools/types/types/plugin'

declare global {
  namespace GYTools {
    type Plugin = _Plugin
    type PluginManifest = Manifest
    type InstallPluginManifest = InstallManifest
  }

  // eslint-disable-next-line no-var
  var __gy_ipc__ = unknown
}
