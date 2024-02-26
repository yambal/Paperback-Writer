

export type LunchedPuppeteer = {
  browser: any
  page: any
}

export const lunchPuppeteer = (executablePath: string, language: string): Promise<LunchedPuppeteer> => {
  return new Promise((resolve, reject) => {
    const puppeteer = require('puppeteer-core')
    return puppeteer.launch({
      executablePath: executablePath || puppeteer.executablePath(),
      args: ['--lang='+language, '--no-sandbox', '--disable-setuid-sandbox']
    }).then((browser: any) => {
      return browser.newPage()
      .then((page: any) => {
        page.setDefaultTimeout(0)
        const lb: LunchedPuppeteer = {
          browser,
          page
        }
        resolve(lb)
      })
      .catch((error: any) => {
        browser.close()
        reject(error)
      })
    })
  })
}