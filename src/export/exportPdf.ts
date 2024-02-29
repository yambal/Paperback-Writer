import { LunchedPuppeteer } from "../lunchPuppeteer"

export type PuppeteerOutputType = "pdf" | "png" | "jpeg"

export type PdfOption = {
  scale: number | undefined
  isDisplayHeaderAndFooter: boolean
  headerTemplate: string
  footerTemplate: string
  isPrintBackground: boolean
  orientationIsLandscape: boolean
  pageRanges: string
  format: string
  width: string
  height: string
  margin: {
    top: string
    right: string
    bottom: string
    left: string
  }
}

export type ExportPdfProps = {
  outputType: PuppeteerOutputType,
  lunchedPuppeteerPage: LunchedPuppeteer['page']
  exportFilename: string
  pdfOption: PdfOption
}

export const exportPdf = ({
  outputType,
  lunchedPuppeteerPage,
  exportFilename,
  pdfOption,
}: ExportPdfProps): Promise<void> => {

  return new Promise((resolve, reject) => {
    const format = !pdfOption.width && !pdfOption.height ? pdfOption.format ?? 'A4' : ''
    const options = {
      path: exportFilename,
      scale: pdfOption.scale || 1,
      displayHeaderFooter: pdfOption.isDisplayHeaderAndFooter,
      headerTemplate: transformTemplate(pdfOption.headerTemplate),
      footerTemplate: transformTemplate(pdfOption.footerTemplate),
      printBackground: pdfOption.isPrintBackground,
      landscape: pdfOption.orientationIsLandscape,
      pageRanges: pdfOption.pageRanges || '',
      format: format,
      width: pdfOption.width || '',
      height: pdfOption.height || '',
      margin: {
        top: pdfOption.margin.top || '',
        right: pdfOption.margin.right || '',
        bottom: pdfOption.margin.bottom || '',
        left: pdfOption.margin.left || ''
      },
      timeout: 0
    }

    /** PDF化 */
    return lunchedPuppeteerPage.pdf(options)
    .then(() => {
      resolve()
    })
    .catch((error: any) => {
      reject(error)
    })
  })
}

export const transformTemplate = (templateText: string) => {
  if (templateText.indexOf('%%ISO-DATETIME%%') !== -1) {
    templateText = templateText.replace('%%ISO-DATETIME%%', new Date().toISOString().substr(0, 19).replace('T', ' '))
  }
  if (templateText.indexOf('%%ISO-DATE%%') !== -1) {
    templateText = templateText.replace('%%ISO-DATE%%', new Date().toISOString().substr(0, 10))
  }
  if (templateText.indexOf('%%ISO-TIME%%') !== -1) {
    templateText = templateText.replace('%%ISO-TIME%%', new Date().toISOString().substr(11, 8))
  }

  return templateText
}