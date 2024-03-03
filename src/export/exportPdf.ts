import { LunchedPuppeteer } from "../lunchPuppeteer"

export type PuppeteerPdfOutputType = "pdf"

export type PdfFormat = "Letter" | "Legal" | "Tabloid" | "Ledger" | "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6"
export type PdfOrientation = "portrait" | "landscape"

export type PdfOption = {
  /** スケール */
  scale: number | undefined

  /** ヘッダー・フッターの表示 */
  isDisplayHeaderAndFooter: boolean

  /** ヘッダーテンプレート */
  headerTemplate: string

  /** フッターテンプレート */
  footerTemplate: string

  /** 背景の印刷 */
  isPrintBackground: boolean

  /** 横向きの場合はtrue */
  orientationIsLandscape: boolean

  /** ページ範囲 */
  pageRanges: string

  /** ページのフォーマット */
  format?: PdfFormat

  /** 幅 */
  width: string

  /** 高さ */
  height: string

  /** マージン */
  margin: {
    /** 上マージン */
    top: string

    /** 右マージン */
    right: string

    /** 下マージン */
    bottom: string

    /** 左マージン */
    left: string
  }
}

export type ExportPdfProps = {
  /** ランチ済のPuppeteerのページ */
  lunchedPuppeteerPage: LunchedPuppeteer['page']

  /** エクスポートパスファイル */
  exportUri: string

  /** PDFのオプション */
  pdfOption: PdfOption
}

/**
 * ランチ済のPuppeteerのページを指定して、PDFをエクスポートする
 */
export const exportPdf = ({
  lunchedPuppeteerPage,
  exportUri,
  pdfOption,
}: ExportPdfProps): Promise<void> => {

  console.log(pdfOption)

  return new Promise((resolve, reject) => {
    const format = !pdfOption.width && !pdfOption.height ? pdfOption.format ?? 'A4' : ''
    const options = {
      path: exportUri,
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