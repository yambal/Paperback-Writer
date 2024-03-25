import * as vscode from 'vscode'
import { getNls, getPaperbackWriterConfiguration, showMessage } from './util'
import { CheckPuppeteerBinaryProps, checkPuppeteerBinary } from './checkPuppeteerBinary'
import { addIcon } from './util/vscode/vscodeMessage'

/**
 * Chromiumをインストールする
 */

export type InstallChromiumProps = CheckPuppeteerBinaryProps &{
}

export const installChromium = ({
  pathToAnExternalChromium = ''
}: InstallChromiumProps):Promise<void> => {

  return new Promise((resolve, reject) => {
    const pwConf = getPaperbackWriterConfiguration()
    const nls = getNls()

    showMessage({
      message: addIcon(`${addIcon(nls["Installing Chromium"])} ...`),
      type: 'info'
    })

    var statusbarmessage = vscode.window.setStatusBarMessage(`${addIcon(nls["Installing Chromium"])} ...`)

    var StatusbarMessageTimeout = pwConf.StatusbarMessageTimeout

    const puppeteer = require('puppeteer-core')
    const browserFetcher = puppeteer.createBrowserFetcher()

    /** @todo dist を読みにいっているが、テストだからか？ */
    const revision = "756035" // 3.3.0 // require(path.join(__dirname, 'node_modules', 'puppeteer-core', 'package.json')).puppeteer.chromium_revision;
    const revisionInfo = browserFetcher.revisionInfo(revision)

    setProxy()

    return browserFetcher.download(revisionInfo.revision, (downloadedBytes: number, totalBytes: number) => {
      var progress = parseInt(`${downloadedBytes / totalBytes * 100}`)
      vscode.window.setStatusBarMessage(`${addIcon(nls["Installing Chromium"])} ${progress}%` , StatusbarMessageTimeout)
    })
    .then(() => browserFetcher.localRevisions())
    .then((localRevisions: any) => {
      localRevisions = localRevisions.filter((revision: any) => revision !== revisionInfo.revision)

      // Remove previous chromium revisions.
      const cleanupOldVersions = localRevisions.map((revision: any)  => browserFetcher.remove(revision))

      if (checkPuppeteerBinary({pathToAnExternalChromium})) {
        statusbarmessage.dispose()
        showMessage({
          message: nls["Successfully installed Chromium"],
          type: "info"
        })
        return Promise.all(cleanupOldVersions)
        .then(() => {
          resolve()
        })
      }
    })
    .catch((error: any) => {
      statusbarmessage.dispose()
      vscode.window.setStatusBarMessage(addIcon(nls["ERROR: Failed to download Chromium!"]), StatusbarMessageTimeout)
      showMessage({
        message: nls["If you are behind a proxy"],
        type: 'error'
      })
      reject()
    })
  })
}

function setProxy() {
  var https_proxy = vscode.workspace.getConfiguration('http')['proxy'] || ''
  if (https_proxy) {
    process.env.HTTPS_PROXY = https_proxy
    process.env.HTTP_PROXY = https_proxy
  }
}