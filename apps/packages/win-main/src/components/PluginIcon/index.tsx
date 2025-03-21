import { memo, useState } from 'react'
import styles from './styles.module.less'

interface Props {
  size?: number
  src?: string
  name?: string
}

const NameIcon = ({ name, size }: { name?: string, size: number }) => {
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const n = name?.trim().charAt(0) || 'ICO'
  const wh = size + 'px'
  return (
    <div className={styles.name} style={{ width: wh, height: wh }}>{n}</div>
  )
}

const ImgIcon = ({ src, size, name }: { src: string, size: number, name?: string }) => {
  const [isError, setError] = useState(false)
  const wh = size + 'px'
  return isError ? <NameIcon name={name} size={size} /> : (
    <div className={styles.imgContainer} style={{ width: wh, height: wh }}>
      <img className={styles.img} src={src} onError={() => {
        setError(true)
      }} />
    </div>
  )
}

export const PluginIcon = memo(function PluginIcon({ size = 50, src, name }: Props) {
  return (
    src ? <ImgIcon src={src} size={size} name={name} /> : <NameIcon name={name} size={size} />
  )
})

