
import path from 'node:path'
import del from 'del'
import Spinnies from 'spinnies'
import colors from 'picocolors'
import { runBuildWorkerStatus, type TaksName } from './utils'
// import rendererConfig from './configs/renderer'
import { dynamicImport } from './import-esm.cjs'
import type { Vite } from './types'

// process.env.VITE_CJS_TRACE = 'true'

const rootPath = path.join(__dirname, '../../../../')

const runMainThread = async() => {
  const { createLogger } = await dynamicImport('vite') as typeof Vite
  const logger = createLogger('info')
  console.time('Build time')
  del.sync(['dist/**', 'build/**'], { cwd: rootPath })

  const noop = () => {}


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
    runBuildWorkerStatus('electron', noop).then(handleResult('electron')),
    // build(rendererConfig, noop).then(handleResult('renderer')),
  ]

  if (!await Promise.all(buildTasks).then((result) => result.every(s => s))) {
    console.timeEnd('Build time')
    throw new Error('Build failed')
  }

  // listr.run().then(() => {

  logger.info(colors.green('\nAll task build successfully'))
  // })
  console.timeEnd('Build time')
}

void runMainThread().then(() => {
  process.exit(0)
}).catch(err => {
  console.log(err)
  throw err
})
