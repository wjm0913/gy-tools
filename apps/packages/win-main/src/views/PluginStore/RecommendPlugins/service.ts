import { request } from '@/shared/request'
import { useRequest } from 'ahooks'

export interface RecommendPlugin {
  id: number
  name: string
  displayName: string
  description: string
  banner: string
  icon: string
  log: string
  version: string
  homepage: string
  author: string
  email: string
  package: string
  categories: string[]
  tags: string[]
  permissions: string[]
}

export const useRecommendPluginList = () => {
  return useRequest(async() => {
    return request<RecommendPlugin[]>('/software/plugin/list')
    // return new Promise<RecommendPlugin[]>((resolve, reject) => {
    //   setTimeout(() => {
    //     // reject(new Error('123'))
    //     resolve([
    //       {
    //         id: 0,
    //         name: 'host',
    //         displayName: 'HOSTS工具',
    //         description: 'HOST工具使用最广、好评最多、多部门推荐使用的工具',
    //         banner: 'http://10.12.54.75/gytools/cabinet_banner.png',
    //         icon: '',
    //         log: '',
    //         version: '0.0.0',
    //         homepage: '',
    //         author: '',
    //         email: '',
    //         package: 'http://10.12.54.75/gytools/gy-tools-plugin-host-0.1.0.gytp',
    //         categories: [],
    //         tags: [],
    //         permissions: [],
    //       },
    //     ])
    //   }, 2000)
    // })
  })
}
