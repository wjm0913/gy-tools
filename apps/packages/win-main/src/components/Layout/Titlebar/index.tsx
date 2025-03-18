import { type FC, useMemo } from 'react'
import { Button } from 'antd'
import styles from './styles.module.less'
import { CloseOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SyncOutlined } from '@ant-design/icons'
import { useSettingValue, useView } from '@/store/app/reactive'
import { setView, updateSetting } from '@/store/app/actions'
import { stopPlugin, reloadCurrentPlugin } from '@/store/plugin/actions'
import { appState } from '@/store/app/state'
import { views } from '@/views'


export const Titlebar: FC = () => {
  const viewInfo = useView()
  const collapsed = useSettingValue('common.asideCollapsed')
  const handleCollapsed = () => {
    updateSetting({ 'common.asideCollapsed': !collapsed })
  }
  const title = useMemo(() => {
    if (viewInfo.id == 'Welcome') return null
    const handleReload = () => {
      reloadCurrentPlugin()
    }
    return (
      <>
        <div>{viewInfo.title}</div>
        {
          viewInfo.showReload ? (
            <Button
              size='small'
              type='text'
              icon={<SyncOutlined />}
              onClick={handleReload}
              className={styles.closeBtn}
            />
          ) : null
        }
        <Button
          type='text'
          icon={<CloseOutlined />}
          onClick={() => {
            if (viewInfo.id == 'PluginStore' || !appState.appSetting['common.startupShowPluginView']) {
              setView({ id: 'Welcome', title: '' })
            } else {
              setView({ id: 'PluginStore', title: views.PluginStore.title })
            }
            if (viewInfo.id == 'Plugin' && viewInfo.pliginId) {
              stopPlugin(viewInfo.pliginId)
            }
          }}
          className={styles.closeBtn}
          size='small'
        />
      </>
    )
  }, [viewInfo])
  return (
    <div className={`titlebar ${styles.container} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.left}>
        <Button
          size='small'
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={handleCollapsed}
          className='icon-collapse'
        />
      </div>
      <div className={styles.center}>
        {title}
      </div>
      <div className={styles.logo}>GY Tools</div>
    </div>
  )
}
