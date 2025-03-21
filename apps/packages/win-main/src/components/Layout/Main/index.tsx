import styles from './styles.module.less'
import { useView } from '@/store/app/reactive'
import { useEffect, useMemo, useRef } from 'react'
import { views } from '@/views'
import { onDomSizeChanged } from '@/shared/dom'
import { setPluginViewPosition } from '@/shared/ipc/plugin'

export const Main = () => {
  const viewInfo = useView()
  const domContextRef = useRef<HTMLDivElement>(null)


  const view = useMemo(() => {
    return views[viewInfo.id].component
  }, [viewInfo.id])

  useEffect(() => {
    if (!domContextRef.current) return
    return onDomSizeChanged(domContextRef.current, setPluginViewPosition)
  }, [])

  return (
    <div ref={domContextRef} className={styles.container}>
      {view}
    </div>
  )
}
