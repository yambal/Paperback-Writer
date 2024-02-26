import { isExistsPath } from "./util"
import { showMessage } from "./vscode-util"
import * as vscode from 'vscode'

export const checkPuppeteerBinary = () => {
  console.group('checkPuppeteerBinary()')
  
  try {
    
    const executablePath = vscode.workspace.getConfiguration('palerback-writer')['executablePath'] || ''
    if (isExistsPath(executablePath)) {
      return true
    }

    // bundled Chromium
    const puppeteer = require('puppeteer-core')
    const puppeteer_executablePath = puppeteer.executablePath()

    if (puppeteer_executablePath && isExistsPath(puppeteer_executablePath)) {
      return true
    } else {
      return false
    }

  } catch (error) {
    showMessage({
      message: `checkPuppeteerBinary(): ${error}`,
      type: 'error'
    })

  } finally {
    console.groupEnd()
  }
}
