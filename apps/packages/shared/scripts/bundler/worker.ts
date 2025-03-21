import { type MessagePort, parentPort } from 'node:worker_threads'
import { type TaksName, build } from './utils'

import { buildConfig as buildElectronConfig } from '@gy-tools/electron'
import { dynamicImport } from './import-esm.cjs'
import { DEV_SERVER_PORTS } from '@gy-tools/common/constants'

if (!parentPort) throw new Error('Require run in worker')

const getWinMainConfig = async() => {
  const { buildConfig } = await dynamicImport('@gy-tools/win-main')
  return buildConfig(DEV_SERVER_PORTS['win-main'])
}

let buildResult: {
  status: boolean
  reload: () => void
}

parentPort.on('message', async({ port, taskName }: {
  port?: MessagePort
  taskName: TaksName
}) => {
  if (!port) {
    buildResult?.reload()
    return
  }
  const configs = {
    electron: buildElectronConfig(),
    'win-main': await getWinMainConfig(),
  } as const
  // assert(port instanceof MessagePort)
  const sendStatus = () => {
    port.postMessage({
      status: 'updated',
    })
  }
  void build(configs[taskName], sendStatus).then((result) => {
    buildResult = result
    port.postMessage({
      status: result.status ? 'success' : 'error',
    })
  })
})
