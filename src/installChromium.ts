import * as vscode from 'vscode';
import path from 'path';
import { showErrorMessage, showInformationMessage } from './vscode-util';
import { checkPuppeteerBinary } from './checkPuppeteerBinary';

/*
 * puppeteer install.js
 * https://github.com/GoogleChrome/puppeteer/blob/master/install.js
 */
export const installChromium = () => {
  try {
    showInformationMessage('[Markdown PDF] Installing Chromium ...', "...");
    var statusbarmessage = vscode.window.setStatusBarMessage('$(markdown) Installing Chromium ...');

    // proxy setting
    setProxy();

    var StatusbarMessageTimeout = vscode.workspace.getConfiguration('markdown-pdf')['StatusbarMessageTimeout'];
    const puppeteer = require('puppeteer-core');
    console.log(puppeteer.createBrowserFetcher)
    const browserFetcher = puppeteer.createBrowserFetcher();
    const revision = "722234" // require(path.join(__dirname, 'node_modules', 'puppeteer-core', 'package.json')).puppeteer.chromium_revision;
    const revisionInfo = browserFetcher.revisionInfo(revision);

    // download Chromium
    browserFetcher.download(revisionInfo.revision, onProgress)
      .then(() => browserFetcher.localRevisions())
      .then(onSuccess)
      .catch(onError);

    function onSuccess(localRevisions: any) {
      console.log('Chromium downloaded to ' + revisionInfo.folderPath);
      localRevisions = localRevisions.filter((revision: any) => revision !== revisionInfo.revision);
      // Remove previous chromium revisions.
      const cleanupOldVersions = localRevisions.map((revision: any)  => browserFetcher.remove(revision));

      if (checkPuppeteerBinary()) {
        statusbarmessage.dispose();
        vscode.window.setStatusBarMessage('$(markdown) Chromium installation succeeded!', StatusbarMessageTimeout);
        vscode.window.showInformationMessage('[Markdown PDF] Chromium installation succeeded.');
        return Promise.all(cleanupOldVersions);
      }
    }

    function onError(error: any) {
      statusbarmessage.dispose();
      vscode.window.setStatusBarMessage('$(markdown) ERROR: Failed to download Chromium!', StatusbarMessageTimeout);
      showErrorMessage('Failed to download Chromium! \
        If you are behind a proxy, set the http.proxy option to settings.json and restart Visual Studio Code. \
        See https://github.com/yzane/vscode-markdown-pdf#install', error);
    }

    function onProgress(downloadedBytes: number, totalBytes: number) {
      var progress = parseInt(`${downloadedBytes / totalBytes * 100}`);
      vscode.window.setStatusBarMessage('$(markdown) Installing Chromium ' + progress + '%' , StatusbarMessageTimeout);
    }
  } catch (error) {
    showErrorMessage('installChromium()', error);
  }
}

function setProxy() {
  var https_proxy = vscode.workspace.getConfiguration('http')['proxy'] || '';
  if (https_proxy) {
    process.env.HTTPS_PROXY = https_proxy;
    process.env.HTTP_PROXY = https_proxy;
  }
}