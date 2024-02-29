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

export type ImageOption = {
  quality: number | undefined
  clip: {
    x: number | null
    y: number | null
    width: number | null
    height: number | null
  }
  fullPage: boolean
  omitBackground: boolean
}

export type ExportPdfProps = {
  outputType: PuppeteerOutputType,
  lunchedPuppeteerPage: LunchedPuppeteer['page']
  exportFilename: string
  pdfOption: PdfOption
  imageOption: ImageOption
}

export const exportPdf = ({
  outputType,
  lunchedPuppeteerPage,
  exportFilename,
  pdfOption,
  imageOption
}: ExportPdfProps): Promise<void> => {

  return new Promise((resolve, reject) => {

    if (outputType === 'pdf') {
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
    } else if (outputType === 'png' || outputType === 'jpeg') {
      const quality_option = outputType === 'png' ? undefined : imageOption.quality || 100

      // screenshot size
      const clip_x_option = imageOption.clip.x || null
      const clip_y_option = imageOption.clip.y || null
      const clip_width_option = imageOption.clip.width || null
      const clip_height_option = imageOption.clip.height || null
      let options
      if (clip_x_option !== null && clip_y_option !== null && clip_width_option !== null && clip_height_option !== null) {
        options = {
          path: exportFilename,
          quality: quality_option,
          fullPage: imageOption.fullPage,
          clip: {
            x: clip_x_option,
            y: clip_y_option,
            width: clip_width_option,
            height: clip_height_option,
          },
          omitBackground: imageOption.omitBackground,
        }
      } else {
        options = {
          path: exportFilename,
          quality: quality_option,
          fullPage: true,
          omitBackground: imageOption.omitBackground,
        }
      }
      return lunchedPuppeteerPage.screenshot(options)
      .then(() => {
        resolve()
      })
      .catch((error: any) => {
        reject(error)
      })
    }
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