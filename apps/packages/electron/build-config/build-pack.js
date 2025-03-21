/* eslint-disable no-template-curly-in-string */

const path = require('path')
const builder = require('electron-builder')
const afterPack = require('./build-after-pack')
const afterSign = require('./notarize')

const params = {}

for (const param of process.argv.slice(2)) {
  const [name, value] = param.split('=')
  params[name] = value
}

if (params.target == null) throw new Error('Missing target')
if (params.target != 'dir' && params.arch == null) throw new Error('Missing arch')
if (params.target != 'dir' && params.type == null) throw new Error('Missing type')

console.log(params.target, params.arch, params.type, params.publish ?? '')

if (params.target == 'mac') require('dotenv').config({ debug: true, path: path.resolve(__dirname, '.env') })

const entitlementsPath = path.join(__dirname, 'entitlements.mac.plist')

/**
* @type {import('electron-builder').Configuration}
* @see https://www.electron.build/configuration/configuration
*/
const options = {
  appId: 'cn.gydev.tools',
  productName: 'gy-tools',
  extraMetadata: {
    name: 'gy-tools',
    main: 'dist/electron/main.js',
  },
  afterPack,
  directories: {
    buildResources: './resources',
    output: './build',
  },
  files: [
    '!node_modules/**/*',
    'dist/**/*',
  ],
  asar: {
    smartUnpack: false,
  },
  extraResources: [
    './resources',
  ],
  electronDownload: {
    mirror: 'https://npmmirror.com/mirrors/electron/',
  },
  // publish: [
  //   {
  //     provider: 'github',
  //     owner: '',
  //     repo: '',
  //   },
  // ],
  publish: [
    {
      provider: 'generic',
      url: 'http://10.12.54.75/gytools/versions',
    },
  ],
}
/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const winOptions = {
  win: {
    icon: './resources/logo.png',
    // icon: './resources/icons/icon.ico',
    // legalTrademarks: 'lyswhut',
    // artifactName: '${productName}-v${version}-${env.ARCH}-${env.TARGET}.${ext}',
  },
  nsis: {
    oneClick: false,
    language: '2052',
    allowToChangeInstallationDirectory: true,
    differentialPackage: true,
    // license: './licenses/license.rtf',
    shortcutName: 'GY Tools',
  },
}
/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const macOptions = {
  afterSign,
  mac: {
    icon: './resources/logo.png',
    // icon: './resources/icons/icon.icns',
    // category: 'public.app-category.music',
    gatekeeperAssess: false,
    hardenedRuntime: true,
    entitlements: entitlementsPath,
    entitlementsInherit: entitlementsPath,
    // artifactName: '${productName}-${version}.${ext}',
  },
  dmg: {
    sign: false,
    // 安装窗口背景颜色：这个属性涉及到字母的只能用小写，否则打包会报错
    backgroundColor: '#ff607e',
    // icon: 'assets/dmg-icon.icns',
    iconSize: 160,
    window: {
      width: 540,
      height: 380,
    },
    contents: [
      {
        x: 130,
        y: 190,
      },
      {
        x: 410,
        y: 190,
        type: 'link',
        path: '/Applications',
      },
    ],
    title: 'GY Tools v${version}',
  },
}

const createTarget = {
  /**
   *
   * @param {*} arch
   * @param {*} packageType
   * @returns {{ buildOptions: import('electron-builder').CliOptions, options: import('electron-builder').Configuration }}
   */
  win(arch, packageType) {
    switch (packageType) {
      case 'setup':
        winOptions.artifactName = `\${productName}-v\${version}-${arch}-Setup.\${ext}`
        return {
          buildOptions: { win: ['nsis'] },
          options: winOptions,
        }
      case 'green':
        winOptions.artifactName = `\${productName}-v\${version}-win_${arch}-green.\${ext}`
        return {
          buildOptions: { win: ['7z'] },
          options: winOptions,
        }
      case 'win7_green':
        winOptions.artifactName = `\${productName}-v\${version}-win7_${arch}-green.\${ext}`
        return {
          buildOptions: { win: ['7z'] },
          options: winOptions,
        }
      case 'portable':
        winOptions.artifactName = `\${productName}-v\${version}-${arch}-portable.\${ext}`
        return {
          buildOptions: { win: ['portable'] },
          options: winOptions,
        }
      default: throw new Error('Unknown package type: ' + packageType)
    }
  },
  /**
   *
   * @param {*} arch
   * @param {*} packageType
   * @returns {{ buildOptions: import('electron-builder').CliOptions, options: import('electron-builder').Configuration }}
   */
  mac(arch, packageType) {
    switch (packageType) {
      case 'dmg':
        macOptions.artifactName = `\${productName}-\${version}-${arch}.\${ext}`
        return {
          buildOptions: { mac: ['dmg', 'zip'] },
          options: macOptions,
        }
      default: throw new Error('Unknown package type: ' + packageType)
    }
  },
}

/**
 *
 * @param {'win' | 'mac' | 'linux' | 'dir'} target 构建目标平台
 * @param {'x86_64' | 'x64' | 'x86' | 'arm64' | 'armv7l'} arch 包架构
 * @param {*} packageType 包类型
 * @param {'onTagOrDraft' | 'always' | 'never'} publishType 发布类型
 */
const build = async(target, arch, packageType, publishType) => {
  if (target == 'dir') {
    await builder.build({
      dir: true,
      config: { ...options, ...winOptions, ...macOptions },
    })
    return
  }
  const targetInfo = createTarget[target](arch, packageType)
  // Promise is returned
  await builder.build({
    ...targetInfo.buildOptions,
    publish: publishType ?? 'never',
    x64: arch == 'x64' || arch == 'x86_64',
    ia32: arch == 'x86' || arch == 'x86_64',
    arm64: arch == 'arm64',
    armv7l: arch == 'armv7l',
    universal: arch == 'universal',
    config: { ...options, ...targetInfo.options },
  })
  // .then((result) => {
  //   console.log(JSON.stringify(result))
  // })
  // .catch((error) => {
  //   console.error(error)
  // })
}

build(params.target, params.arch, params.type, params.publish)
