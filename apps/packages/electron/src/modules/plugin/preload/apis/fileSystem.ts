import { sendSaveDialog, sendOpenDialog } from '../ipc'
import fs from 'node:fs'
import type { Plugin_API } from '@gy-tools/types/types/plugin_api'

export const fileSystem: Plugin_API['fileSystem'] = {
  /** 显示通知 */
  async showOpenDialog(options) {
    return sendOpenDialog(options)
  },
  /** 消息弹窗 */
  async showSaveDialog(options) {
    return sendSaveDialog(options)
  },
  /**
   * 读取文件
   * @param path 文件路径
   * @param encoding 文件编码
   * @param toEncoding 读取后的编码转换
   * @returns
   */
  async readFile(path: string, encoding?: BufferEncoding, toEncoding?: BufferEncoding) {
    return (await fs.promises.readFile(path, encoding)).toString(toEncoding)
  },

  /**
   * 写入文件
   * @param path 文件路径
   * @param data 文件数据
   * @param dataEncoding 数据编码
   * @returns
   */
  async writeFile(path: string, data: string, dataEncoding?: BufferEncoding) {
    return fs.promises.writeFile(path, Buffer.from(data, dataEncoding))
  },

  /**
   * 读取目录
   * @param path 目录路径
   * @returns
   */
  async ls(path: string) {
    return fs.promises.readdir(path)
  },

  /**
   * 创建目录
   * @param path 目录
   * @param recursive 是否递归创建
   * @returns
   */
  async mkdir(path: string, recursive?: boolean) {
    return fs.promises.mkdir(path, { recursive })
  },

  /**
   * 查询文件信息
   * @param path 路径
   * @returns
   */
  async stat(path: string) {
    const stat = await fs.promises.stat(path)
    return {
      isFile: stat.isFile(),
      isDirectory: stat.isDirectory(),
      modifiedTimeMs: stat.mtimeMs,
      creatTimeMs: stat.birthtimeMs,
      size: stat.size,
    }
  },
} as const
