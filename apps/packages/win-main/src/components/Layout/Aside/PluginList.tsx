import { Button } from 'antd'
import styles from './styles.module.less'
import { usePluginActive, usePluginList } from '@/store/plugin/reactive'
import { runAndShowPlugin } from '@/store/plugin/actions'
import { PluginIcon } from '@/components/PluginIcon'
import { useSettingValue } from '@/store/app/reactive'
import { updateSetting } from '@/store/app/actions'

const ListItem = ({ item }: { item: GYTools.Plugin }) => {
  const collapsed = useSettingValue('common.asideCollapsed')
  const active = usePluginActive(item)
  return (
    <Button
      className={`${styles.listItem} ${active ? styles.active : ''}`}
      type="text"
      title={item.displayName}
      block
      onClick={() => {
        runAndShowPlugin(item)
        if (!collapsed) updateSetting({ 'common.asideCollapsed': true })
      }}
    >
      <PluginIcon name={item.displayName} src={item.icon} size={collapsed ? 42 : 30} />
      {collapsed ? '' : item.displayName}
    </Button>
  )
}

export const PluginList = ({ collapsed }: { collapsed: boolean }) => {
  const pluginList = usePluginList()
  return (
    <div className={styles.listContainer}>
      {collapsed ? null : <div className={styles.listHeader}>我的插件</div>}
      <div className={styles.list}>
        { pluginList.map(item => <ListItem key={item.name} item={item} />) }
      </div>
    </div>
  )
}
