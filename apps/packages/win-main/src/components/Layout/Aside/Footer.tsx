import { Button, message } from 'antd'
import styles from './styles.module.less'
import { AppstoreOutlined } from '@ant-design/icons'
import { type AppState } from '@/store/app/state'
import { setView } from '@/store/app/actions'
import { views } from '@/views'
import { useSettingValue } from '@/store/app/reactive'

// const btns = [
// {
//   title: views.Settings.title,
//   icon: <SettingOutlined />,
//   id: 'Settings',
// },
//   {
//     title: views.PluginStore.title,
//     icon: <AppstoreOutlined />,
//     id: 'PluginStore',
//   },
// ] as const

export const Footer = () => {
  const collapsed = useSettingValue('common.asideCollapsed')
  const toView = (id: AppState['view']['id'], title: string) => {
    if (id == 'Settings') {
      void message.info('敬请期待')
      return
    }
    setView({
      id,
      title,
    })
  }
  return (
    collapsed
      ? (
          <div className={styles.footer}>
            <Button block size='middle' onClick={() => { toView('PluginStore', views.PluginStore.title) }} icon={<AppstoreOutlined />} />
            {/* <Button block size='middle' icon={<SettingOutlined />}>设置</Button> */}
          </div>
        )
      : (
          <div className={styles.footer}>
            <Button block size='middle' onClick={() => { toView('PluginStore', views.PluginStore.title) }} icon={<AppstoreOutlined />}>插件市场</Button>
            {/* <Button block size='middle' icon={<SettingOutlined />}>设置</Button> */}
          </div>
        )
  // <div className={styles.footer}>
  //   {
  //     btns.map(btn => {
  //       return (
  //         <Tooltip title={btn.title} key={btn.id}>
  //           {/* <Button onClick={() => { toView(btn.id, btn.title) }} icon={btn.icon}></Button> */}
  //           <Button onClick={() => { toView(btn.id, btn.title) }} icon={btn.icon}></Button>
  //         </Tooltip>
  //       )
  //     })
  //   }
  // </div>
  )
}
