import { type HttpCallback, type Options, request as _request, requestPromise as _requestPromise } from '@/shared/lib/request'
// import progress from 'request-progress'
// import fs from 'fs'

// export const requestMsg = {
//   fail: '请求异常😮，可以多试几次，若还是不行就换一首吧。。。',
//   unachievable: '哦No😱...接口无法访问了！',
//   timeout: '请求超时',
//   // unachievable: '哦No😱...接口无法访问了！已帮你切换到临时接口，重试下看能不能播放吧~',
//   notConnectNetwork: '无法连接到服务器',
//   cancelRequest: '取消http请求',
// } as const

export const request = <Res>(url: string, _options: Partial<Options>, callback: HttpCallback<Res>) => {
  return _request<Res>(url, _options, callback)
}

export const requestPromise = async <Res>(url: string, _options: Partial<Options>) => {
  return _requestPromise<Res>(url, _options)
}

export type { Options }
