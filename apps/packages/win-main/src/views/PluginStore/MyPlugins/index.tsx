import { Button, Flex, Popconfirm } from 'antd'
import './index.less'
import { usePluginList } from '@/store/plugin/reactive'
import { DeleteOutlined } from '@ant-design/icons'
import { removePlugin } from '@/store/plugin/actions'

const Index = () => {
  const plugins = usePluginList()
  return (
    <div className="my-plugin-wrap">
      <div className="title">我的插件</div>
      <Flex gap="15px">
        {plugins.length <= 0 && <div>暂无插件</div>}
        {plugins?.map((item) => {
          return (
            <div className="list-item" title={item.displayName} key={item.name}>
              <span className="list-item-title">{item.displayName}</span>
              <Popconfirm
                description="你确认要移除当前插件吗？"
                title=""
                icon=""
                onConfirm={() => removePlugin(item.name) }
                okType='danger'
              >
                <Button type='text' icon={<DeleteOutlined />} />
              </Popconfirm>
            </div>
          )
        })}
      </Flex>
    </div>
  )
}

export const MyPlugins = Index
