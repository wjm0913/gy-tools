import { type FC } from 'react'
import { type RecommendPlugin } from './service'
import { addPlugin, removePlugin, updatePlugin } from '@/store/plugin/actions'
import { useAsync } from '@/shared/hooks'
import {
  DeleteOutlined,
  DownloadOutlined,
  RedoOutlined,
} from '@ant-design/icons'
import { Button, Popconfirm, Skeleton } from 'antd'

const UpdateBtn: FC<{ info: RecommendPlugin }> = ({ info }) => {
  const { loading, run } = useAsync(updatePlugin)
  return (
    <Button
      variant="filled"
      color='primary'
      icon={<RedoOutlined />}
      loading={loading}
      onClick={() => {
        run(info.package, { name: info.name })
      }}
    />
  )
}

const DownloadBtn: FC<{ info: RecommendPlugin }> = ({ info }) => {
  const { loading, run } = useAsync(addPlugin)
  return (
    <Button
      type="text"
      icon={<DownloadOutlined />}
      loading={loading}
      onClick={() => {
        run(info.package, { name: info.name })
      }}
    />
  )
}

const RemoveBtn: FC<{ name: string, displayName: string }> = ({ name, displayName }) => {
  const { loading, run } = useAsync(removePlugin)
  return (
    <Popconfirm
      description={`确认卸载 ${displayName} 插件吗?`}
      onConfirm={() => {
        run(name)
      }}
      title=""
      icon=""
      okText="确认"
      cancelText="取消"
    >
      <Button type="text" icon={<DeleteOutlined />} loading={loading} />
    </Popconfirm>
  )
}
export const ListItem: FC<{ info: RecommendPlugin & { installed: boolean, newVersion: boolean } }> = ({ info }) => {
  return (
    <div className="list-item">
      <img className="back" src={info.banner} alt="" />
      <div className="name">{info.displayName}</div>
      <div className="desc">{info.description}</div>
      <div className="download">
        <div>{info.newVersion && '发现新版本！'}</div>
        <div>
          {info.installed ? (
            <RemoveBtn name={info.name} displayName={info.displayName} />
          ) : (
            <DownloadBtn info={info} />
          )}
          {info.newVersion && <UpdateBtn info={info} />}
        </div>
      </div>
    </div>
  )
}

export const Loading = () => {
  return (
    <div className="list-item">
      <Skeleton.Image className="back" active />
      <Skeleton active style={{ padding: '10px' }} />
    </div>
  )
}
