import setSystemHosts from './hosts/setSystemHosts';
import getSystemHosts from './hosts/getSystemHosts';
import type { Custom } from '../types/preload'

const customApi: Custom = {
  async setSystemHosts(hosts) {
    await setSystemHosts(hosts)
  },
  async getSystemHosts() {
    return getSystemHosts()
  },
}
module.exports = customApi
