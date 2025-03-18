import React from 'react'
import { Button, Card, Space } from 'antd'
import { showOpenDialog } from '@/shared/ipc/app'
import { FILE_NAMES } from '@gy-tools/common/constants'
import { addPlugin, parseDevPlugin, runAndShowPlugin } from '@/store/plugin/actions'
import { useAsync } from '@/shared/hooks'
import { CodeOutlined, FileZipOutlined, FolderOpenOutlined } from '@ant-design/icons'

const handleOpenDir = async() => {
  const ret = await showOpenDialog({
    title: '选择已解压的插件文件夹',
    properties: ['openDirectory'],
  })
  if (ret.canceled) return
  addPlugin(ret.filePaths[0])
}
const handleOpenFile = async() => {
  const ret = await showOpenDialog({
    title: '选择插件安装包',
    filters: [
      { extensions: [FILE_NAMES.pluginBundleExtName], name: 'GY Tools插件安装包' },
    ],
    properties: ['openFile'],
  })
  if (ret.canceled) return
  addPlugin(ret.filePaths[0])
}
const handleOpenDevDir = async() => {
  const ret = await showOpenDialog({
    title: '选择插件输出文件夹',
    properties: ['openDirectory'],
  })
  if (ret.canceled) return
  const plugin = await parseDevPlugin(ret.filePaths[0])
  console.log(plugin)
  await runAndShowPlugin(plugin)
}
export const LocalInstall = () => {
  const { loading: openDirLoading, run: openDir } = useAsync(handleOpenDir)
  const { loading: openFileLoading, run: openFile } = useAsync(handleOpenFile)
  const { loading: openDevDirLoading, run: openDevDir } = useAsync(handleOpenDevDir)
  const loading = openDirLoading || openDevDirLoading || openFileLoading
  return (
    <Card title='本地安装' size='small'>
      <Space>
        <Button loading={loading} icon={<FolderOpenOutlined />} onClick={openDir}>选择插件文件夹</Button>
        <Button loading={loading} icon={<FileZipOutlined />} onClick={openFile}>选择插件安装包</Button>
        <Button loading={loading} icon={<CodeOutlined />} onClick={openDevDir}>加载插件开发目录</Button>
      </Space>
    </Card>
  )
}

