import { restartUpdate } from '@/shared/ipc/app'
import { useUpdateDownloadProgress } from '@/store/app/reactive'
import { sizeFormate } from '@gy-tools/common/utils'
import { Alert, Button } from 'antd'
import { type FC, useMemo, useState } from 'react'

const DownloadAlert: FC<{
  downloaded: boolean
  progress: ReturnType<typeof useUpdateDownloadProgress>['progress']
}> = ({ downloaded, progress }) => {
  const [hideBtn, setHideBtn] = useState(false)
  const message = useMemo(() => {
    return downloaded
      ? '更新已下载完成！'
      : progress
        ? `新版本下载中：${progress.percent.toFixed(2)}% - ${sizeFormate(
          progress.current,
        )}/${sizeFormate(progress.total)} - ${sizeFormate(progress.speed)}/s`
        : '发现新版本，正在处理更新中...'
  }, [downloaded, progress])

  return (
    <Alert
      message={message}
      type="info"
      banner
      action={
        downloaded && !hideBtn ? (
          <Button size="small" type="primary" onClick={() => {
            setHideBtn(true)
            restartUpdate()
          }}>
            重启安装更新
          </Button>
        ) : null
      }
    />
  )
}

export const UpdateBar = () => {
  const info = useUpdateDownloadProgress()

  return info.status == 'downloading' || info.status == 'downloaded' ? (
    <DownloadAlert
      downloaded={info.status == 'downloaded'}
      progress={info.progress}
    />
  ) : null
}
