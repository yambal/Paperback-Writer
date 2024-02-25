import * as vscode from 'vscode'
import { getPaperbackWriterConfiguration, showMessage } from './vscode-util'
import { checkPuppeteerBinary } from './checkPuppeteerBinary'

/**
 * Chromiumをインストールする
 */
export const installChromium = () => {
  console.group('installChromium()')
  const pwConf = getPaperbackWriterConfiguration()

  try {
    showMessage({
      message: `[Markdown PDF] Installing Chromium ...`,
      type: 'info'
    })

    var statusbarmessage = vscode.window.setStatusBarMessage('$(markdown) Installing Chromium ...')

    // proxy setting
    setProxy()

    var StatusbarMessageTimeout = pwConf.StatusbarMessageTimeout
    const puppeteer = require('puppeteer-core')
    const browserFetcher = puppeteer.createBrowserFetcher()
    const revision = "722234" // require(path.join(__dirname, 'node_modules', 'puppeteer-core', 'package.json')).puppeteer.chromium_revision;
    const revisionInfo = browserFetcher.revisionInfo(revision)

    // download Chromium
    browserFetcher.download(revisionInfo.revision, onProgress)
      .then(() => browserFetcher.localRevisions())
      .then(onSuccess)
      .catch(onError)

    function onSuccess(localRevisions: any) {
      console.log('Chromium downloaded to ' + revisionInfo.folderPath)
      localRevisions = localRevisions.filter((revision: any) => revision !== revisionInfo.revision)
      // Remove previous chromium revisions.
      const cleanupOldVersions = localRevisions.map((revision: any)  => browserFetcher.remove(revision))

      if (checkPuppeteerBinary()) {
        statusbarmessage.dispose()
        vscode.window.setStatusBarMessage('$(markdown) Chromium installation succeeded!', StatusbarMessageTimeout)
        vscode.window.showInformationMessage('[Markdown PDF] Chromium installation succeeded.')
        return Promise.all(cleanupOldVersions)
      }
    }

    function onError(error: any) {
      statusbarmessage.dispose()
      vscode.window.setStatusBarMessage('$(markdown) ERROR: Failed to download Chromium!', StatusbarMessageTimeout)
      showMessage({
        message:'Failed to download Chromium! If you are behind a proxy, set the http.proxy option to settings.json and restart Visual Studio Code. See https://github.com/yzane/vscode-markdown-pdf#install',
        type: 'error'
      })
    }

    function onProgress(downloadedBytes: number, totalBytes: number) {
      var progress = parseInt(`${downloadedBytes / totalBytes * 100}`)
      vscode.window.setStatusBarMessage('$(markdown) Installing Chromium ' + progress + '%' , StatusbarMessageTimeout)
    }
  } catch (error) {
    showMessage({
      message: `installChromium(): ${error}`,
      type: 'error'
    })
  } finally {
    console.groupEnd()
  }
}

function setProxy() {
  var https_proxy = vscode.workspace.getConfiguration('http')['proxy'] || ''
  if (https_proxy) {
    console.log('Set proxy: ' + https_proxy) 
    
    process.env.HTTPS_PROXY = https_proxy
    process.env.HTTP_PROXY = https_proxy
  }
}