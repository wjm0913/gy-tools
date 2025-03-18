import path from 'node:path'
import fs from 'node:fs'

export default class Store {
  private readonly filePath: string
  private readonly dirPath: string
  private store: Record<string, any>

  private writeFile() {
    const tempPath = this.filePath + '.' + Math.random().toString().substring(2, 10) + '.temp'
    try {
      fs.writeFileSync(tempPath, JSON.stringify(this.store, null, '\t'), 'utf8')
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        fs.mkdirSync(this.dirPath, { recursive: true })
        fs.writeFileSync(tempPath, JSON.stringify(this.store, null, '\t'), 'utf8')
      } else throw err
    }
    fs.renameSync(tempPath, this.filePath)
  }

  constructor(filePath: string, clearInvalidConfig: boolean = false) {
    this.filePath = filePath
    this.dirPath = path.dirname(this.filePath)

    let store: Record<string, any>
    if (fs.existsSync(this.filePath)) {
      if (clearInvalidConfig) {
        try {
          store = JSON.parse(fs.readFileSync(this.filePath, 'utf8'))
        } catch {
          store = {}
        }
      } else store = JSON.parse(fs.readFileSync(this.filePath, 'utf8'))
    } else store = {}

    if (typeof store != 'object') {
      if (clearInvalidConfig) store = {}
      else throw new Error('parse data error: ' + String(store))
    }
    this.store = store
  }

  get<Value>(key: string): Value | null {
    return this.store[key] ?? null
  }

  getAll<Value extends Record<string, any>>() {
    return this.store as Value
  }

  has(key: string): boolean {
    return key in this.store
  }

  set(key: string, value: any) {
    this.store[key] = value
    this.writeFile()
  }

  override(value: Record<string, any>) {
    this.store = value
    this.writeFile()
  }
}
