import styles from './styles.module.less'


export const Welcome = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>GY Tools</div>
      <p className={styles.tips}>欢迎使用 GY Tools</p>
    </div>
  )
}
