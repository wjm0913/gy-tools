export declare interface Manifest {
  name: string // 插件的名称
  displayName: string // 插件的显示名称
  version: string // 插件的版本号
  description?: string // 插件的详细描述，可选属性
  preview?: string // 插件的预览图 URL，可选属性
  main: string // 插件的主入口文件
  homepage?: string // 插件的主页 URL
  customApi?: string // 自定义 API

  author?: string // 插件的作者名称
  email?: string // 插件的联系邮箱
  categories: string[] // 分类
  tags: string[] // 标签
  icon: string // 插件图标
}
export interface InstallManifest {
  name: Manifest['name'] // 插件的名称
}

export declare interface Plugin extends Manifest {
  directory: string
  dataDirectory: string
  installedTimestamp: number
  updatedTimestamp: number
  isDev: boolean
}
