// import { Header } from './Header'
import { LocalInstall } from './LocalInstall'
import { MyPlugins } from './MyPlugins'
import { RecommendPlugins } from './RecommendPlugins'
import styles from './styles.module.less'


export const PluginStore = () => {
  return (
    <div className={`scroll ${styles.container}`}>
      {/* <Header /> */}
      <MyPlugins />
      <RecommendPlugins />
      <div style={{ flex: 'auto' }}></div>
      <LocalInstall />
    </div>
  )
}

