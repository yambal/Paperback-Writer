import { PDFOptions } from "puppeteer"
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
  exportPathName: string

  /** PDFのオプション */
  pdfOption: PdfOption
}

/**
 * ランチ済のPuppeteerのページを指定して、PDFをエクスポートする
 */
export const exportPdf = ({
  lunchedPuppeteerPage,
  exportPathName,
  pdfOption,
}: ExportPdfProps): Promise<void> => {

  return new Promise((resolve, reject) => {
    const format: PdfFormat | undefined = !pdfOption.width && !pdfOption.height ? pdfOption.format ?? 'A4' : undefined

    const options: PDFOptions = {
      path: exportPathName,
      scale: pdfOption.scale || 1,
      displayHeaderFooter: pdfOption.isDisplayHeaderAndFooter,
      headerTemplate: transformTemplate(header({})),
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

    console.log(`format: ${options.format}, width: ${options.width}, height: ${options.height}`)
    console.log(`margin: ${options.margin?.top}, ${options.margin?.right}, ${options.margin?.bottom}, ${options.margin?.left}`)

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

type HeaderItems = "title" | "pageNumber" | "date" | "url"
type HeaderProps = {
  items: HeaderItems[]
  fontSize?: number
}

const header = ({
  items =['title', 'pageNumber', 'date'],
  fontSize = 14
}: HeaderProps) => {
  /**
   * 本体と関係ない文脈
   **/
  // mm、cm、in、px
  // 1cm = 28.35px

  const headerMargin = {
    top: toPx('0cm') - 36,
    right: toPx('1cm'),
    left: toPx('1cm')
  }

  console.log('headerMargin: ', `${headerMargin.top}px ${headerMargin.right}px 0 ${headerMargin.left}px`)

  const headerFontSize = fontSize // * 2


  const itemsElement = items.map((item, index) => {
    if (item === 'title') {
      return `<span class='title'></span>`
    }
    if (item === 'pageNumber') {
      return `<div><span class='pageNumber'></span> 世界の大手企業 <span class='totalPages'></span></div>`
    }
    if (item === 'date') {
      return `<span class='date'>%%ISO-DATE%%</span>`
    }
    if (item === 'url') {
      return `<span class='url'></span>`
    }
  })

  return `
  <div style="width: 100%; margin: ${headerMargin.top}px ${headerMargin.right}px 0 ${headerMargin.left}px; height: ${headerFontSize}px; font-size: 10px; display: flex; justify-content: space-between; align-items: center; background-color: red;">
    ${itemsElement.join('\n')}
  </div>
  `
}

const toPx = (value: string) => {
  // 単位と数値を抽出
  const match = value.match(/^(\d+(?:\.\d+)?)(cm|mm|in)$/)
  if (!match) {
    throw new Error('Invalid input')
  }

  const num = parseFloat(match[1])
  const unit = match[2]

  // 単位に応じてピクセル値に変換
  switch (unit) {
    case 'cm':
      return num * 28
    case 'mm':
      return num * 2.8
    case 'in':
      return num * 96
    default:
      throw new Error('Unsupported unit')
  }
}