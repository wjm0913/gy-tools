import './env.prod.js'
import htmlConfig from './vite.config.html.js'
import preloadConfig from './vite.config.preload.js'
import { build } from './utils.js'
import { createMainifest } from './mainifest.js'
import { pack } from './pack.js'

const run = async() => {
  await Promise.all([
    build(htmlConfig, () => {

    }),
    build(preloadConfig, () => {

    }),
    createMainifest(),
  ])
  await pack()
}

run()
