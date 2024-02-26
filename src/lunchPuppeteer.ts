
export const lunchPuppeteer = (executablePath: string, language: string): Promise<{browser: any, page:any}> => {
  return new Promise((resolve, reject) => {
    const puppeteer = require('puppeteer-core')
    return puppeteer.launch({
      executablePath: executablePath || puppeteer.executablePath(),
      args: ['--lang='+language, '--no-sandbox', '--disable-setuid-sandbox']
    }).then((browser: any) => {
      return browser.newPage()
      .then((page: any) => {
        page.setDefaultTimeout(0)
        resolve({
          browser,
          page
        })
      })
      .catch((error: any) => {
        browser.close()
        reject(error)
      })
    })
  })
}