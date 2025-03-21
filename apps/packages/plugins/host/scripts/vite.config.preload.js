import { defineConfig } from 'vite'
import { builtinModules } from 'node:module'
import path from 'node:path'

const isProd = process.env.NODE_ENV == 'production'
const rootPath = path.join(import.meta.dirname, '../')
const projectPath = path.join(rootPath, 'src/preload')

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  mode: process.env.NODE_ENV,
  publicDir: false,
  build: {
    target: 'node16',
    emptyOutDir: true,
    minify: false,
    watch: isProd ? null : {
      buildDelay: 500,
    },
    outDir: path.join(rootPath, 'dist/preload'),
    rollupOptions: {
      input: path.join(projectPath, 'index.ts'),

      external: [
        ...builtinModules.flatMap(m => [m, `node:${m}`]),
      ],
      output: {
        entryFileNames: '[name].cjs',
        chunkFileNames: '[name].cjs',
        format: 'cjs',
        // manualChunks(id, info) {
        // //   return 'main'
        // },
        experimentalMinChunkSize: 50_000,
      },
    },
  },
})
