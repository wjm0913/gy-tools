import getPathOfSystemHosts from './getPathOfSystemHostsPath'
import * as fs from 'fs'

export default async (): Promise<string> => {
  const fn = await getPathOfSystemHosts()

  if (!fs.existsSync(fn)) {
    return ''
  }

  return fs.promises.readFile(fn, 'utf-8')
}