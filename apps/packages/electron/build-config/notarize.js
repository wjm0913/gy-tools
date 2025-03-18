const { notarize } = require('@electron/notarize')

/**
 *
 * @param {import('electron-builder').AfterPackContext} context
 * @returns Promise<void>
 */
module.exports = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context
  if (electronPlatformName !== 'darwin') return

  const appId = context.packager.appInfo.id
  const appName = context.packager.appInfo.productFilename

  const APPLEID = process.env.APPLEID
  const APPLEIDPASS = process.env.APPLEIDPASS
  const TEAMID = process.env.TEAMID

  console.log('notarizing...')

  return await notarize({
    // tool: 'notarytool',
    teamId: TEAMID,
    appBundleId: appId,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: APPLEID,
    appleIdPassword: APPLEIDPASS,
  })
}
