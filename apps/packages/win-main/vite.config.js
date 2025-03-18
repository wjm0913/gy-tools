import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { createHtmlPlugin } from 'vite-plugin-html'
import react from '@vitejs/plugin-react-swc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isProd = process.env.NODE_ENV == 'production'
const rootPath = path.join(__dirname, '../../')
const projectPath = path.join(rootPath, 'packages/win-main')
const electronPath = path.join(rootPath, 'packages/electron')

export const lessConfig = {
  modifyVars: {
    hack: `true; @import "${path.join(projectPath, 'src/assets/styles/mixin.less')}";`,
  },
}


export const buildConfig = (port = 9200) => {
  // const lessConfig = {
  //   modifyVars: {
  //     hack: `true; @import "${path.join(projectPath, 'src/assets/styles/mixin.less')}";`,
  //   },
  // }
  const publicDir = path.join(rootPath, 'packages/electron/dist')

  /**
   * @type {import('vite').UserConfig}
   */
  const config = {
    mode: process.env.NODE_ENV == 'production' ? 'production' : 'development',
    root: projectPath,
    base: './',
    publicDir: isProd ? false : publicDir,
    logLevel: 'warn',
    resolve: {
      alias: {
        '@': path.join(projectPath, 'src'),
      },
    },
    plugins: [
      react(),
      createSvgIconsPlugin({
        iconDirs: [path.join(projectPath, 'src/assets/svgs')],
      }),
      createHtmlPlugin({
        minify: true,
        entry: 'src/main.tsx',
        template: 'index.html',
        /**
         * If you are using vite that version higher than 5.0.0-beta.13, you can set viteNext to true to align vite's config
         */
        viteNext: true,
      }),
    ],
    build: {
      target: 'esnext',
      outDir: path.join(electronPath, 'dist/win-main'),
      modulePreload: false,
      emptyOutDir: true,
      reportCompressedSize: false,
      // assetsDir: 'chunks',
      assetsDir: './',
      sourcemap: isProd,
      minify: isProd,
      watch: isProd ? null : {
        buildDelay: 500,
      },
      rollupOptions: {
        // input: {
        //   'win-main': 'index.html',
        // },
        output: {
          entryFileNames: '[name].js',
          format: 'cjs',
          experimentalMinChunkSize: 50_000,
        // manualChunks: {
        //   'iconv-lite': ['iconv-lite'],
        // },
        },
        logLevel: 'warn',
        onwarn(warning, defaultHandler) {
          if (warning.code === 'SOURCEMAP_ERROR') {
            return
          }

          defaultHandler(warning)
        },
      },
      commonjsOptions: {
        include: [
          /vendors/,
          /node_modules/,
          // /utils\/musicMeta/,
        ],
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          ...lessConfig,
          javascriptEnabled: true,
        },
      },
    },
    optimizeDeps: {
      //   // exclude: [],
      include: [
        // '@common/utils/musicMeta',
        // '@win-main/utils/musicSdk/kg/vendors/infSign.min',
      ],
    },
    server: {
      port,
    },
    worker: {
      rollupOptions: {
        output: {
          entryFileNames: '[name].js',
          inlineDynamicImports: true,
          format: 'iife',
          experimentalMinChunkSize: 50_000,
        },
        logLevel: 'warn',
      },
      // format: 'es',
    },
    // cacheDir: path.join(projectPath, 'node_modules/.vite/win-main'),
  }

  return config
}

export default defineConfig(() => {
  return buildConfig()
})
