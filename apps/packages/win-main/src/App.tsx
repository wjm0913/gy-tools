import { Aside } from '@/components/Layout/Aside'
import { Titlebar } from '@/components/Layout/Titlebar'
import { Main } from '@/components/Layout/Main'
import './app.less'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { UpdateBar } from './components/Layout/UpdateBar'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Aside />
      <div id="main">
        <Titlebar />
        <UpdateBar />
        <Main />
      </div>
    </ConfigProvider>
  )
}

export default App
