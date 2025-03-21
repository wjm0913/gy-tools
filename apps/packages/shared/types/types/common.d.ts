

declare namespace GYTools {
  type BuildTarget = 'electron' | 'web'

  interface IPCActionBase<A> {
    action: A
  }
  interface IPCActionData<A, D> extends IPCActionBase<A> {
    data: D
  }
  type IPCAction<A, D = undefined> = D extends undefined ? IPCActionBase<A> : IPCActionData<A, D>

  // 更新信息
  type UpdateInfo = {
    type: 'checking'
  } | {
    type: 'available'
    info: {
      isAutoUpdate: boolean
      version: string
      // url: string
      log?: string | null
      // isForce: boolean
    }
  } | {
    type: 'not-available'
  } | {
    type: 'error'
  } | {
    type: 'download-progress'
    info: {
      speed: number
      percent: number
      total: number
      current: number
    }
  } | {
    type: 'downloaded'
  }
}
