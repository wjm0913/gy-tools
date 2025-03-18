import { type ChildProcessWithoutNullStreams } from 'node:child_process'
import colors from 'picocolors'
// import del from 'del'
import type { Logger } from 'vite'
import { type TaksName, buildSuatus, runBuildWorkerStatus } from './utils'
import Spinnies from 'spinnies'
import { runElectron, buildConfig } from '@gy-tools/electron'
import { debounce } from '@gy-tools/common/utils'

import { dynamicImport } from './import-esm.cjs'
import type { Vite } from './types'
import treeKill from 'tree-kill'

let logger: Logger

// del.sync(['dist/**'])


const logs = [
  'Manifest version 2 is deprecated, and support will be removed in 2023',
  '"Extension server error: Operation failed: Permission denied", source: devtools://devtools/bundled',

  // https://github.com/electron/electron/issues/32133
  '"Electron sandbox_bundle.js script failed to run"',
  '"TypeError: object null is not iterable (cannot read property Symbol(Symbol.iterator))",',
]
function electronLog(data: Buffer, color: 'red' | 'blue') {
  let log = data.toString()
  if (/[0-9A-z]+/.test(log)) {
    // 抑制某些无关的报错日志
    if (color == 'red' && typeof log === 'string' && logs.some(l => log.includes(l))) return

    logger.info(colors[color](log))
  }
}

const runMainThread = async() => {
  console.time('init')
  const { createLogger } = await dynamicImport('vite') as typeof Vite
  logger = createLogger('info')

  // let server: ViteDevServer | undefined
  let electronProcess: ChildProcessWithoutNullStreams | undefined
  const runElectronDelay = debounce(() => {
    electronProcess = runElectron(electronLog)
  }, 200)

  const noop = () => {}
  const handleUpdate = () => {
    logger.info(colors.green('\nrebuild the electron main process successfully'))

    if (electronProcess) {
      electronProcess.removeAllListeners()
      treeKill(electronProcess.pid!)
    }
    runElectronDelay()

    logger.info(colors.green('\nrestart electron app...'))
  }

  const spinners = new Spinnies({ color: 'blue' })
  spinners.add('win-main', { text: 'win-main compiling' })
  spinners.add('electron', { text: 'electron compiling' })
  const handleResult = (name: TaksName) => {
    return (success: boolean) => {
      if (success) {
        spinners.succeed(name, { text: name + ' compile success!' })
      } else {
        spinners.fail(name, { text: name + ' compile fail!' })
      }
      return success
    }
  }

  const buildTasks = [
    runBuildWorkerStatus('win-main', noop).then(handleResult('win-main')),
    buildSuatus(buildConfig(), handleUpdate).then(handleResult('electron')),
  ]

  if (!await Promise.all(buildTasks).then((result) => result.every(s => s))) return
  // listr.run().then(() => {
  electronProcess = runElectron(electronLog)

  logger.info(colors.green('\nAll task build successfully'))
  // })
  console.timeEnd('init')
}

void runMainThread()


