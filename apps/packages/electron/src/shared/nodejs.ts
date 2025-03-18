import fs from 'node:fs'
import crypto from 'node:crypto'
import { gunzip, gzip } from 'node:zlib'
import path from 'node:path'

// 重命名 process 防止 vite 转换
export const nodeProcess = process


export const joinPath = (...paths: string[]): string => path.join(...paths)

export const extname = (p: string): string => path.extname(p)
export const basename = (p: string, ext?: string): string => path.basename(p, ext)
export const dirname = (p: string): string => path.dirname(p)
export const isAbsolute = (p: string) => path.isAbsolute(p)

/**
 * 检查路径是否存在
 * @param {*} path 路径
 */
export const checkPath = async(path: string) => fs.promises
  .access(path, fs.constants.R_OK | fs.constants.W_OK)
  .then(() => true)
  .catch(() => false)

/**
 * 检查文件是否存在
 * @param path 文件路径
 * @returns
 */
export const checkFile = async(path: string) => fs.promises
  .access(path, fs.constants.F_OK)
  .then(() => true)
  .catch(() => false)

export const getFileStats = async(path: string) => fs.promises.stat(path).catch(() => null)
export const renamePath = async(path: string, newPath: string) => fs.promises
  .rename(path, newPath).then(() => true)
  .catch(() => false)

/**
 * 检查路径并创建目录
 * @param path
 * @returns
 */
export const checkAndCreateDir = async(path: string) =>
  fs.promises.access(path, fs.constants.F_OK | fs.constants.W_OK)
    .catch(async err => {
      if (err.code != 'ENOENT') throw err
      return fs.promises.mkdir(path, { recursive: true })
    })

/**
 * 创建文件夹
 * @param path
 * @returns
 */
export const createDir = async(path: string) => {
  return fs.promises.mkdir(path, { recursive: true })
}


export const removePath = async(path: string) => fs.promises.rm(path, { recursive: true })


export const removeFile = async(path: string) => new Promise<void>((resolve, reject) => {
  fs.access(path, fs.constants.F_OK, err => {
    if (err) {
      err.code == 'ENOENT' ? resolve() : reject(err)
      return
    }
    fs.unlink(path, err => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
})

export const readFile = async(path: string) => fs.promises.readFile(path)


/**
 * 创建 MD5 hash
 * @param {*} str
 */
export const toMD5 = (str: string) => crypto.createHash('md5').update(str).digest('hex')

export const randomUUID = () => crypto.randomUUID()

export const gzipData = async(str: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    gzip(str, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })
}

export const gunzipData = async(buf: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    gunzip(buf, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result.toString())
    })
  })
}

/**
 * 保存lx配置文件
 * @param path 保存路径
 * @param data 数据
 */
export const saveLxConfigFile = async(path: string, data: any) => {
  if (!path.endsWith('.lxmc')) path += '.lxmc'
  fs.writeFile(path, await gzipData(JSON.stringify(data)), 'binary', err => {
    console.log(err)
  })
}

/**
 * 读取lx配置文件
 * @param path 文件路径
 * @returns 数据
 */
export const readLxConfigFile = async(path: string): Promise<any> => {
  let isJSON = path.endsWith('.json')
  let data: string | Buffer = await fs.promises.readFile(path, isJSON ? 'utf8' : 'binary')
  if (!data) return data
  if (!isJSON) data = await gunzipData(Buffer.from(data, 'binary'))
  data = JSON.parse(data)

  // 修复v1.14.0出现的导出数据被序列化两次的问题
  if (typeof data != 'object') {
    try {
      data = JSON.parse(data)
    } catch (err) {
      return data
    }
  }

  return data
}

export const saveStrToFile = async(path: string, str: string | Buffer): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    fs.writeFile(path, str, err => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

export const b64DecodeUnicode = (str: string): string => {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  // return decodeURIComponent(window.atob(str).split('').map(function(c) {
  //   return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  // }).join(''))

  return Buffer.from(str, 'base64').toString()
}

export const copyFile = async(sourcePath: string, distPath: string) => {
  return fs.promises.cp(sourcePath, distPath, {
    recursive: true,
  })
}

export const moveFile = async(sourcePath: string, distPath: string) => {
  return fs.promises.rename(sourcePath, distPath)
}

export const createDirSync = (path: string) => {
  if (!fs.existsSync(path)) {
    try {
      fs.mkdirSync(path, { recursive: true })
    } catch (e: any) {
      if (e.code !== 'EEXIST') {
        console.error('Could not set up log directory, error was: ', e)
        process.exit(1)
      }
    }
  }
}

const fileNameRxp = /[\\/:*?#"<>|]/g
export const filterFileName = (name: string): string => name.replace(fileNameRxp, '')

export const checkAndCreateDirSync = (path: string) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  }
}


export const isLinux = process.platform == 'linux'
export const isWin = process.platform == 'win32'
export const isMac = process.platform == 'darwin'
export const isProd = process.env.NODE_ENV == 'production'
