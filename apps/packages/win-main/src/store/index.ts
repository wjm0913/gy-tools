import { views } from '@/views'
import { getSetting, initSetting, registerRemoteSettingAction, registerRemoteUpdateInfo, setView } from './app/actions'
import { getLocalPlugins, setPluginList, stopAllPlugins } from './plugin/actions'


export const initStore = async() => {
  void stopAllPlugins()
  const setting = await getSetting()
  initSetting(setting)
  registerRemoteSettingAction()
  registerRemoteUpdateInfo()
  if (setting['common.startupShowPluginView']) {
    setView({ id: 'PluginStore', title: views.PluginStore.title })
  }
  const list = await getLocalPlugins()
  setPluginList(list)
}
