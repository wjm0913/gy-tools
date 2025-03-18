import './env.dev.js'
import htmlConfig from './vite.config.html.js'
import preloadConfig from './vite.config.preload.js'
import { build } from './utils.js'
import { createMainifest } from './mainifest.js'

const run = async() => {
  Promise.all([
    build(htmlConfig, () => {

    }),
    build(preloadConfig, () => {

    }),
    createMainifest(`http://localhost:${htmlConfig.server.port}`),
  ])
}

run()
