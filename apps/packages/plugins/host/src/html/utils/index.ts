
export const storage = {
  inited: false,
  data: {} as Record<string, unknown>,
  async init() {
    if (this.inited) return
    const data = await gyTools.storage.getData()
    if (data) this.data = JSON.parse(data)
    this.inited = true
  },
  async getData<T = unknown>(key: string) {
    await this.init()
    return this.data[key] as T | undefined
  },
  async setData(key: string, value: string | number | null | object) {
    await this.init()
    this.data[key] = value
    await gyTools.storage.saveData(JSON.stringify(this.data))
  }
}

export const getSystemHosts = () => {
  return gyTools.custom.getSystemHosts()
}

export const saveSystemHosts = (hosts: string) => {
  return gyTools.custom.setSystemHosts(hosts)
}
