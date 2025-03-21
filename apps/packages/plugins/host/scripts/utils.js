
import { build as viteBuild, mergeConfig, createServer } from 'vite'

/**
 * build code
 * @param {import('vite').UserConfig} config vite config
 * @param {() => void} onUpdated new build event
 * @returns {Promise<{ status: boolean, reload: () => void }>} is success
 */
export const build = async(config, onUpdated) => {
  if (process.env.NODE_ENV === 'production') {
    if (config.build) config.build.watch = null
    return viteBuild({ ...config, configFile: false }).then(() => {
      // output
      // console.log(output)
      return { status: true, reload: () => {} }
    }).catch((error) => {
      console.log(error)
      return { status: false, reload: () => {} }
    })
  }

  return config.server
    ? createBuildServer(config, onUpdated)
    : buildDev(config, onUpdated)
}


/**
 * build code in dev
 * @param {import('vite').UserConfig} config vite config
 * @param {() => void} onUpdated new build event
 * @returns {Promise<{ status: boolean, reload: () => void }>} is success
 */
const buildDev = async(config, onUpdated) => {
  return new Promise(resolve => {
    let firstBundle = true
    let isError = false
    config = mergeConfig(config, {
      plugins: [
        {
          name: 'vite:file-watcher',
          buildEnd(err) {
            // console.log('buildEnd', err !== undefined, err)
            isError = err !== undefined
          },
          closeBundle() {
            // console.log('closeBundle')
            if (firstBundle) {
              firstBundle = false
              resolve({ status: !isError, reload: () => {} })
            } else {
              if (isError) return
              onUpdated()
            }
          },
        },
      ],
    })

    viteBuild({ ...config, configFile: false })
  })
}

/**
 * build code in dev
 * @param {import('vite').UserConfig} config vite config
 * @param {() => void} onUpdated new build event
 * @returns {Promise<{ status: boolean, reload: () => void }>} is success
 */
export const createBuildServer = async(config, onUpdated) => {
  return new Promise(resolve => {
    let firstBundle = true
    let isError = false
    createServer({
      ...mergeConfig(config, {
        plugins: [
          {
            name: 'vite:file-watcher',
            buildEnd(err) {
              // console.log('buildEnd', err !== undefined, err)
              isError = err !== undefined
            },
            closeBundle() {
              // console.log('closeBundle')
              if (firstBundle) {
                firstBundle = false
                // resolve(!isError)
              } else {
                if (isError) return
                onUpdated()
              }
            },
          },
        ],
      }),
      configFile: false,
    }).then(async server => {
      return server.listen().then(() => {
        resolve({
          status: true,
          reload() {
            server.ws.send({
              type: 'full-reload',
            })
          },
        })
      })
    }).catch((error) => {
      console.log(error)
      resolve({
        status: false,
        reload() {},
      })
    })

    // return build(config, () => {
    // // server.ws.send({ type: 'full-reload' })
    //   onUpdated()
    // })
  })
}

/**
 * build code in dev
 * @param {import('vite').UserConfig} config vite config
 * @param {() => void} onUpdated new build event
 * @returns {Promise<{ status: boolean, reload: () => void }>} is success
 */
export const buildSuatus = async(config, onUpdated) => {
  return build(config, onUpdated).then(({ status }) => status)
}

