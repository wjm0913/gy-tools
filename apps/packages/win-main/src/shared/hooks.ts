import { useCallback, useState } from 'react'


export const useAsync = <T extends (...args: any[]) => Promise<any>>(task: T) => {
  const [loading, setLoading] = useState(false)

  const run = useCallback(async(...args: any[]) => {
    setLoading(true)
    return task(...args).finally(() => {
      setLoading(false)
    })
  }, [task]) as T

  return {
    loading,
    run,
  }
}
