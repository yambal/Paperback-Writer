import { isExistsPath } from "./util"
import { showErrorMessage, showInformationMessage } from "./vscode-util"
import * as vscode from 'vscode';


export const checkPuppeteerBinary = () => {
  console.group('checkPuppeteerBinary()')
  try {
    // settings.json
    const executablePath = vscode.workspace.getConfiguration('palerback-writer')['executablePath'] || ''
    showInformationMessage('configuration palerback-writer.executablePath', `"${executablePath}"`)

    if (isExistsPath(executablePath)) {
      showInformationMessage('isExistsPath', `"${executablePath}"`)
      return true;
    }

    // bundled Chromium
    const puppeteer = require('puppeteer-core')

    const puppeteer_executablePath = puppeteer.executablePath()
    
    console.log('puppeteer_executablePath', puppeteer_executablePath)

    if (puppeteer_executablePath && isExistsPath(puppeteer_executablePath)) {
      return true;
    } else {
      return false;
    }


  } catch (error) {
    showErrorMessage('checkPuppeteerBinary()', error);
  } finally {
    console.groupEnd()
  }
}
