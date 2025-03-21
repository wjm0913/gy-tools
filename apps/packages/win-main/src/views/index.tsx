import { Welcome } from './Welcome'
import { Plugin } from './Plugin'
import { PluginStore } from './PluginStore'
import { Settings } from './Settings'

export const views = {
  Welcome: {
    title: '欢迎',
    component: <Welcome />,
  },
  Plugin: {
    title: '',
    component: <Plugin />,
  },
  PluginStore: {
    title: '插件商店',
    component: <PluginStore />,
  },
  Settings: {
    title: '设置',
    component: <Settings />,
  },
} as const


export type ViewId = keyof typeof views
