import styles from './styles.module.less'
import { PluginList } from './PluginList'
import { type FC } from 'react'
import { Footer } from './Footer'
import { useSettingValue } from '@/store/app/reactive'


export const Aside: FC = () => {
  const collapsed = useSettingValue('common.asideCollapsed')
  return (
    <div className={`${styles.container} ${collapsed ? styles.collapsed : ''}`}>
      {
        collapsed ? <div className={styles.logo}>GYT</div> : <div className={styles.logo}>GY Tools</div>
      }
      <PluginList collapsed={collapsed} />
      <Footer />
    </div>
  )
}
