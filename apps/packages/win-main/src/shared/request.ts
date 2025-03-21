import { message } from 'antd'

const baseUrl = 'http://i.gydev.cn/gytools'
// const baseUrl = 'http://127.0.0.1:31099'

enum AbortType {
  TIMEOUT = 'request timeout',
  CANCELLED = 'request cancel',
}

interface ClientRequestOptions {
  method?: 'get' | 'post' | 'put' | 'head' | 'delete' | 'patch'
  /** URL 参数 */
  params?: Record<string, string | number | null | undefined>
  /** 请求头参数 */
  headers?: Record<string, string>
  /** 请求体参数 json */
  json?: Record<string, unknown>
  /** 请求体参数 form */
  form?: Record<string, unknown>
  /** 请求体参数 formdata */
  formData?: FormData
  /** 请求体参数 原始请求参数，建议先使用 `json`、`form`、`formData` 属性 */
  body?: XMLHttpRequestBodyInit
  /** 超时，单位：毫秒，默认 30,000 毫秒 */
  timeout?: number
  /** 终止请求信号 */
  signal?: RequestInit['signal']
  /** 是否处理请求异常，默认true */
  handleError?: boolean
}
export interface Response<T> {
  message: string
  code: number
  data: T
}

const applyRequestTimeout = (abortSignal: AbortController, time = 30_000) => {
  let timeout: number | null = setTimeout(() => {
    timeout = null
    abortSignal.abort(AbortType.TIMEOUT)
  }, time)
  return () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }
}

const buildParams = (params: Record<string, unknown>) => {
  return Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v ?? ''))}`)
    .join('&')
}
const buildQueryString = (url: string, params?: ClientRequestOptions['params']) => {
  if (!params) return ''
  return (url.includes('?') ? (/\?.+/.test(url) ? '&' : '') : '?') + buildParams(params)
}

export const request = async <Res = unknown>(path: string, { ...options }: ClientRequestOptions = {}) => {
  const abortSignal = new AbortController()
  const cancelTimeout = options.timeout !== 0 ? applyRequestTimeout(abortSignal, options.timeout) : null

  // eslint-disable-next-line eqeqeq
  if (options.handleError == null) options.handleError = true
  if (options.signal) {
    options.signal.addEventListener(
      'abort',
      () => {
        abortSignal.abort(options.signal?.reason)
        cancelTimeout?.()
      },
      { once: true },
    )
  }
  if (!options.headers) options.headers = {}
  let body: XMLHttpRequestBodyInit | undefined
  if (options.json !== undefined) {
    if (!options.headers['Content-Type']) options.headers['Content-Type'] = 'application/json'
    body = JSON.stringify(options.json)
  } else if (options.form !== undefined) {
    if (!options.headers['Content-Type']) {
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    body = buildParams(options.form)
  } else if (options.formData !== undefined) {
    body = options.formData
  } else body = options.body
  return fetch(`${path.startsWith('http') ? '' : baseUrl}${path}${buildQueryString(path, options.params)}`, {
    headers: options.headers,
    method: options.method,
    body,
    signal: abortSignal.signal,
  })
    .then(async(response) => {
      if (response.status !== 200) throw new Error(response.statusText)
      const resp = await (response.json() as Promise<Response<Res>>)
      if (resp.code != 0) throw new Error(resp.message)
      return resp.data
    })
    .catch((err: Error) => {
      if (abortSignal.signal.aborted && err.name === 'AbortError') {
        // eslint-disable-next-line no-param-reassign
        err = new Error(abortSignal.signal.reason)
      }
      if (options.handleError && err.message !== AbortType.CANCELLED) void message.error(err.message)
      throw err
    })
    .finally(() => {
      cancelTimeout?.()
    })
}
