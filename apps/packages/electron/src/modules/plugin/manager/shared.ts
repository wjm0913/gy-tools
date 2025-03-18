import fs from 'node:fs'
import path from 'node:path'
import { WebContentsView } from 'electron'
import { joinPath, isAbsolute, getFileStats, checkFile, dirname, basename, copyFile, checkPath, toMD5, removePath, extname, createDir, renamePath } from '@/shared/nodejs'
import { pluginState } from '../state'
import { FILE_NAMES } from '@gy-tools/common/constants'
import { winMainState } from '@/renderer/winMain/state'
import got from 'got'
import { version as appVersion } from '../../../../package.json'
import { encodePath } from '@/shared/electron'

const preloadPath = path.join(__dirname, './plugin.preload.js')

const FILE_EXT_NAME = `.${FILE_NAMES.pluginBundleExtName}`
const FILE_EXT_NAME_EXP = new RegExp(`\\.${FILE_NAMES.pluginBundleExtName}$`, 'i')

const buildPath = async(pluginPath: string, _path: string) => {
  if (isAbsolute(_path)) throw new Error(`path not a relative path: ${_path}`)
  const enterFilePath = joinPath(pluginPath, _path)
  if (!enterFilePath.startsWith(pluginPath + path.sep)) throw new Error('main path illegal')
  return enterFilePath
}

const verifyManifest = async(pluginPath: string, manifest: GYTools.PluginManifest, isDev: boolean) => {
  if (manifest.name != null) manifest.name = String(manifest.name)
  if (!manifest.name) throw new Error('Manifest name not defined')
  if (/[^\w-_]/.test(manifest.name)) throw new Error('Manifest ID Illegal')

  if (manifest.displayName != null) manifest.displayName = String(manifest.displayName)
  if (!manifest.displayName) throw new Error('Manifest displayName not defined')

  if (manifest.description != null) manifest.description = String(manifest.description)
  if (manifest.icon != null) manifest.icon = String(manifest.icon)
  manifest.icon = manifest.icon ? await buildPath(pluginPath, manifest.icon).catch(() => '') : ''

  if (manifest.main != null) manifest.main = String(manifest.main)
  if (!(isDev && /^https?:\/\//.test(manifest.main))) {
    manifest.main = await buildPath(pluginPath, manifest.main)
  }
  if (manifest.customApi != null) {
    manifest.customApi = String(manifest.customApi)
    manifest.customApi = await buildPath(pluginPath, manifest.customApi)
  }

  if (manifest.version != null) manifest.version = String(manifest.version)
  if (manifest.author != null) manifest.author = String(manifest.author)
  if (manifest.homepage != null) manifest.homepage = String(manifest.homepage)
  if (Array.isArray(manifest.categories)) {
    manifest.categories = manifest.categories.map(categorie => String(categorie))
  } else manifest.categories = []
  if (Array.isArray(manifest.tags)) {
    manifest.tags = manifest.tags.map(tag => String(tag))
  } else manifest.tags = []

  return manifest
}

export const parsePlugin = async(pluginPath: string, isDev = false): Promise<GYTools.Plugin | null> => {
  const manifest = await fs.promises.readFile(joinPath(pluginPath, FILE_NAMES.pluginMainifestName))
    .then(async buf => {
      const manifest = JSON.parse(buf.toString('utf-8')) as GYTools.PluginManifest
      return verifyManifest(pluginPath, manifest, isDev)
    }).catch((err) => {
      console.log(err)
      if (isDev) throw err
      return null
    })
  if (!manifest) return null
  return {
    name: manifest.name,
    displayName: manifest.displayName,
    description: manifest.description,
    icon: manifest.icon,
    version: manifest.version,
    author: manifest.author,
    homepage: manifest.homepage,
    categories: manifest.categories,
    tags: manifest.tags,

    main: manifest.main,
    customApi: manifest.customApi,
    directory: pluginPath,
    dataDirectory: joinPath(isDev ? pluginState.tempDir : pluginState.dataDir, manifest.name),
    installedTimestamp: Date.now(),
    updatedTimestamp: 0,
    isDev,
  }
}


/**
 * 隐藏插件
 * @param id 插件id
 */
export const hidePlugin = async(id: string) => {
  const targetPlugin = pluginState.runningPlugins.get(id)
  if (!targetPlugin) return
  if (!winMainState.browserWindow) throw new Error('main window not defined')
  winMainState.browserWindow.contentView.removeChildView(targetPlugin.view)
  targetPlugin.visible = false
}

/**
 * 显示插件
 * @param id 插件id
 */
export const showPlugin = async(id: string) => {
  const targetPlugin = pluginState.runningPlugins.get(id)
  if (!targetPlugin) return
  if (!winMainState.browserWindow) throw new Error('main window not defined')
  winMainState.browserWindow.contentView.addChildView(targetPlugin.view)
  targetPlugin.view.setBounds(pluginState.pluginViewPosition)
  // targetPlugin.view.webContents.openDevTools()
  targetPlugin.visible = true
}

export const loadPlugin = async(plugin: GYTools.Plugin) => {
  if (!winMainState.browserWindow) throw new Error('main window not defined')
  const view = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      sandbox: false,
      // nodeIntegration: false,
      preload: preloadPath,
      webSecurity: false,
      allowRunningInsecureContent: false,
    },
  })

  pluginState.runningPlugins.set(plugin.name, {
    info: plugin,
    view,
    visible: false,
  })
  view.webContents.loadURL(/^https?:/.test(plugin.main) ? plugin.main : 'file://' + encodePath(plugin.main)).catch(err => {
    console.log(err, plugin.main, 'errr:::::; view.webContents.loadURL(pluginPath)')
  })

  if (plugin.isDev) {
    view.webContents.openDevTools({
      mode: 'undocked',
    })
  }

  await showPlugin(plugin.name)
}

/**
 * 停止插件
 * @param id 插件id
 */
export const stopPlugin = async(id: string) => {
  const targetPlugin = pluginState.runningPlugins.get(id)
  if (!targetPlugin) return
  await hidePlugin(id)
  targetPlugin.view.removeAllListeners()
  targetPlugin.view.webContents.close()
  pluginState.runningPlugins.delete(id)
}

/**
 * 停止所有插件
 */
export const stopAllPlugins = async() => {
  try {
    for (const id of pluginState.runningPlugins.keys()) {
      await stopPlugin(id)
    }
  } catch (err) {
    console.error(err)
  }
}


export const removePlugins = async(plugins: GYTools.Plugin[]) => {
  while (plugins.length) {
    const ext = plugins.shift()!
    await Promise.all([
      removePath(ext.directory).catch(_ => _),
      removePath(ext.dataDirectory).catch(_ => _),
    ])
  }
}


export const downloadPlugin = async(url: string, manifest?: GYTools.InstallManifest) => {
  if (!/^https?:\/\//i.test(url)) {
    const stats = await getFileStats(url)
    if (!stats) throw new Error(`Invalid plugin path: ${url}`)
    if (stats.isFile()) {
      if (await checkFile(url)) {
        if (pluginState.tempDir == dirname(url)) return url
        const tempPath = joinPath(pluginState.tempDir, basename(url))
        await copyFile(url, tempPath)
        return tempPath
      }
    } else {
      if (await checkPath(url)) {
        if (pluginState.tempDir == dirname(url)) return url
        const tempPath = joinPath(pluginState.tempDir, basename(url))
        await copyFile(url, tempPath)
        return tempPath
      }
    }
    throw new Error(`Unable to read the path: ${url}`)
  }

  const bundlePath = joinPath(pluginState.tempDir, `${toMD5(manifest?.name ?? Math.random().toString())}${FILE_EXT_NAME}`)
  const downloadStream = got.stream(url, {
    headers: {
      'user-agent': `gy-tools v${appVersion}`,
    },
  })
  const fileWriterStream = fs.createWriteStream(bundlePath)
  // Promisify the stream completion
  await new Promise((resolve, reject) => {
    downloadStream.on('error', (err: Error) => {
      fileWriterStream.close()
      reject(err)
    })
    downloadStream.pipe(fileWriterStream).on('finish', resolve).on('error', reject)
  }).catch(async err => {
    await removePath(bundlePath)
    throw err
  })
  return bundlePath
}


export const unpackPlugin = async(bundlePath: string) => {
  if (extname(bundlePath).toLowerCase() != FILE_EXT_NAME) {
    if ((await getFileStats(bundlePath))?.isDirectory()) return bundlePath
    throw new Error(`Unknown file type: ${bundlePath}`)
  }

  const targetDir = bundlePath.replace(FILE_EXT_NAME_EXP, '')
  if (await checkFile(targetDir)) await removePath(targetDir)
  await createDir(targetDir)
  const { x } = await import('tar')
  await x({
    file: bundlePath,
    // strip: 1,
    C: targetDir,
  }).catch(async err => {
    await removePath(targetDir)
    throw err
  })

  return targetDir
}

export const mvPlugin = async(pluginDir: string) => {
  if (dirname(pluginDir) == pluginState.pluginDir) return pluginDir
  const newPath = joinPath(pluginState.pluginDir, basename(pluginDir))
  if (!await renamePath(pluginDir, newPath)) {
    throw new Error(`Could not rename plugin: ${pluginDir}`)
  }
  return newPath
}
