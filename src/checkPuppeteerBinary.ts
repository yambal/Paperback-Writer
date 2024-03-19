import { showMessage, isExistsPath } from "./util"

export type CheckPuppeteerBinaryProps = {
  pathToAnExternalChromium: string
}

export const checkPuppeteerBinary = ({
  pathToAnExternalChromium = ''
}: CheckPuppeteerBinaryProps) => {
  console.group('checkPuppeteerBinary()')
  
  try {
    
    if (isExistsPath(pathToAnExternalChromium)) {
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
      type: "error"
    })

  } finally {
    console.groupEnd()
  }
}
