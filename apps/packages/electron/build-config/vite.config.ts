import path from 'node:path'
import type { UserConfig } from 'vite'
import { builtinModules } from 'node:module'
import { spawn } from 'node:child_process'
import electron from 'electron'

const isProd = process.env.NODE_ENV == 'production'
const rootPath = path.join(__dirname, '../../../')
const projectPath = path.join(rootPath, 'packages/electron')

export { Arch } from 'electron-builder'

export const runElectron = (onLog: (data: Buffer, color: 'red' | 'blue') => void) => {
  let args = [
    '--inspect=5858',
    // 'NODE_ENV=development',
    path.join(projectPath, 'dist/electron/main.js'),
  ]

  // detect yarn or npm and process commandline args accordingly
  if (process.env.npm_execpath?.endsWith('yarn.js')) {
    args = args.concat(process.argv.slice(3))
  } else if (process.env.npm_execpath?.endsWith('npm-cli.js')) {
    args = args.concat(process.argv.slice(2))
  } else if (process.env.npm_execpath?.endsWith('pnpm.cjs')) {
    args = args.concat(process.argv.slice(2))
  }

  const electronProcess = spawn(electron as unknown as string, args, {
    env: {
      NODE_OPTIONS: '--enable-source-maps',
    },
  })

  electronProcess.stdout.on('data', data => {
    onLog(data, 'blue')
  })
  electronProcess.stderr.on('data', data => {
    onLog(data, 'red')
  })

  electronProcess.on('close', () => {
    process.exit()
  })

  return electronProcess
}


export const buildConfig = (): UserConfig => {
  return {
    mode: process.env.NODE_ENV == 'production' ? 'production' : 'development',
    root: projectPath,
    base: './',
    publicDir: false,
    logLevel: 'warn',
    resolve: {
      alias: {
        '@': path.join(projectPath, 'src'),
      },
    },
    build: {
      target: 'node16',
      lib: {
        entry: `src/${isProd ? 'index.ts' : 'index-dev.ts'}`,
        formats: ['cjs'],
        fileName: 'main',
      },
      outDir: path.join(projectPath, 'dist/electron'),
      emptyOutDir: true,
      reportCompressedSize: false,
      modulePreload: false,
      // assetsDir: 'chunks',
      sourcemap: !isProd,
      minify: false,
      watch: isProd ? null : {
        buildDelay: 500,
      },
      commonjsOptions: {
        dynamicRequireTargets: ['*.js'],
        ignoreDynamicRequires: true,
      },
      rollupOptions: {
        external: [
          'electron',
          // 'electron-log',
          ...builtinModules.flatMap(m => [m, `node:${m}`]),
        ],
        input: {
          main: path.join(projectPath, `src/${isProd ? 'index.ts' : 'index-dev.ts'}`),
          // 'util-service.worker': path.join(rootPath, 'packages/shared/app/modules/worker/utilService/index.ts'),
          'win-main.preload': path.join(projectPath, 'src/renderer/winMain/preload/index.ts'),
          'plugin.preload': path.join(projectPath, 'src/modules/plugin/preload/index.ts'),
        },
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          format: 'cjs',
          // manualChunks(id, info) {
          // //   return 'main'
          // },
          experimentalMinChunkSize: 50_000,
        },
        logLevel: 'warn',
      },
    },
    define: {
      'process.env.NODE_ENV': `"${process.env.NODE_ENV!}"`,
      __STATIC_PATH__: `"${path.join(projectPath, 'src/static').replace(/\\/g, '\\\\')}"`,
    },
  }
}
