import React, { type FC, useMemo } from 'react'
import { Button, Flex, Space, Col, Row } from 'antd'
import './index.less'
import { usePluginList } from '@/store/plugin/reactive'
import { useRecommendPluginList } from './service'
import { compareVersions } from '@gy-tools/common/utils'
import { ListItem, Loading } from './ListItem'

const LoadingView = () => {
  return (
    <>
      <Loading />
      <Loading />
      <Loading />
    </>
  )
}
const Error: FC<{ onReload: () => void }> = ({ onReload }) => {
  return (
    <Space direction="vertical">
      <p>加载失败:(</p>
      <Button onClick={onReload}>重新加载</Button>
    </Space>
  )
}
const Index: FC = () => {
  const plugins = usePluginList()
  const recommendPluginList = useRecommendPluginList()

  const list = useMemo(() => {
    if (!recommendPluginList.data) return []
    const installedMap = new Map<string, GYTools.Plugin>()
    for (const p of plugins) {
      installedMap.set(p.name, p)
    }
    return recommendPluginList.data.map((info) => {
      const target = installedMap.get(info.name)
      return {
        ...info,
        installed: !!target,
        newVersion: target ? compareVersions(info.version, target.version) > 0 : false,
      }
    })
  }, [recommendPluginList.data, plugins])
  return (
    <div className="recommend-plugin-wrap">
      <div className="title">推荐插件</div>
      <Row gutter={[16, 16]}>
        {recommendPluginList.loading ? (
          <LoadingView />
        ) : recommendPluginList.error ? (
          <Error
            onReload={() => {
              recommendPluginList.run()
            }}
          />
        ) : (
          list.map((item) => <Col xs={24} sm={12} md={8} lg={6} xl={4}><ListItem info={item} key={item.name} /></Col>)
        )}
      </Row>
    </div>
  )
}

export const RecommendPlugins = Index
