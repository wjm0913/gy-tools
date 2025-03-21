export declare interface Custom {
  setSystemHosts: (hosts: string) => Promise<void>
  getSystemHosts: () => Promise<string>
}
