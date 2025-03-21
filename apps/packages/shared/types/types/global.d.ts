import type { Plugin as _Plugin, Manifest, InstallManifest as _InstallPluginManifest } from './plugin'

declare global {
  namespace GYTools {
    type Plugin = _Plugin
    type PluginManifest = Manifest
    type InstallPluginManifest = _InstallPluginManifest
  }
}

