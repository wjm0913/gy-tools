// 非业务工具方法

/**
 * 获取两个数之间的随机整数，大于等于min，小于max
 * @param {*} min
 * @param {*} max
 */
export const getRandom = (min: number, max: number): number => Math.floor(Math.random() * (max - min)) + min


const units = ['B', 'KB', 'MB', 'GB', 'TB']
export const sizeFormate = (size: number): string => {
  // https://gist.github.com/thomseddon/3511330
  if (!size) return '0 B'
  let number = Math.floor(Math.log(size) / Math.log(1024))
  return `${(size / Math.pow(1024, Math.floor(number))).toFixed(2)} ${units[number]}`
}

/**
 * 将字符串、时间戳等格式转成时间对象
 * @param date 时间
 * @returns 时间对象或空字符串
 */
export const toDateObj = (date?: number | string | Date): Date | '' => {
  // console.log(date)
  if (!date) return ''
  switch (typeof date) {
    case 'string':
      if (!date.includes('T')) date = date.split('.')[0].replace(/-/g, '/')
    // eslint-disable-next-line no-fallthrough
    case 'number':
      date = new Date(date)
    // eslint-disable-next-line no-fallthrough
    case 'object':
      break
    default: return ''
  }
  return date
}

const numFix = (n: number): string => n < 10 ? (`0${n}`) : n.toString()
type FormatTypes = 'Y-M-D h:m:s'
| 'Y-M-D h:m'
| 'Y-M-D h'
| 'Y-M-D'
| 'Y-M'
| 'Y'
/**
 * 时间格式化
 * @param _date 时间
 * @param format Y-M-D h:m:s Y年 M月 D日 h时 m分 s秒
 */
export const dateFormat = (_date: number | string | Date, format: FormatTypes = 'Y-M-D h:m:s') => {
  // console.log(date)
  const date = toDateObj(_date)
  if (!date) return ''
  return format
    .replace('Y', date.getFullYear().toString())
    .replace('M', numFix(date.getMonth() + 1))
    .replace('D', numFix(date.getDate()))
    .replace('h', numFix(date.getHours()))
    .replace('m', numFix(date.getMinutes()))
    .replace('s', numFix(date.getSeconds()))
}


export const isUrl = (path: string) => /https?:\/\//.test(path)

// 解析URL参数为对象
export const parseUrlParams = (str: string): Record<string, string> => {
  const params: Record<string, string> = {}
  if (typeof str !== 'string') return params
  const paramsArr = str.split('&')
  for (const param of paramsArr) {
    let [key, value] = param.split('=')
    params[key] = value
  }
  return params
}

/**
 * 生成节流函数
 * @param fn 回调
 * @param delay 延迟
 * @returns
 */
export function throttle<Args extends any[]>(fn: (...args: Args) => void | Promise<void>, delay = 100) {
  let timer: any = null
  let _args: Args
  return (...args: Args) => {
    _args = args
    if (timer) return
    timer = setTimeout(() => {
      timer = null
      void fn(..._args)
    }, delay)
  }
}

/**
 * 生成防抖函数
 * @param fn 回调
 * @param delay 延迟
 * @returns
 */
export function debounce<Args extends any[]>(fn: (...args: Args) => void | Promise<void>, delay = 100) {
  let timer: any = null
  let _args: Args
  return (...args: Args) => {
    _args = args
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      void fn(..._args)
    }, delay)
  }
}

export const encodePath = (path: string) => {
  return encodeURI(path.replaceAll('\\', '/'))
}

// treat non-numerical characters as lower version
// replacing them with a negative number based on charcode of first character
const prep = (t: string) => ('' + t)
  .replace(/[^\d.]+/g, c => '.' + (c.replace(/[\W_]+/, '').toUpperCase().charCodeAt(0) - 65536) + '.')
  // remove trailing "." and "0" if followed by non-numerical characters (1.0.0b);
  .replace(/(?:\.0+)*(\.-\d+(?:\.\d+)?)\.*$/g, '$1')
  // return array
  .split('.')
export const compareVersions = (a: string, b: string) => {
  const aArr = prep(a)
  const bArr = prep(b)
  const l = Math.max(aArr.length, bArr.length)
  let i = 0
  let r = i
  // convert into integer, uncluding undefined values
  while (!r && i < l) { r = ~~aArr[i] - ~~bArr[i++] }
  return r < 0 ? -1 : (r ? 1 : 0)
}
