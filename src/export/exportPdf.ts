import { PDFOptions } from "puppeteer"
import { LunchedPuppeteer } from "../lunchPuppeteer"

const CM_TO_PX_RATE = 28
const FONTSIZE_TO_HEIGHT_RATE = 1.15

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
} & {
  headerProps: Omit<HeaderProps, "headerMargin">
}

/**
 * ランチ済のPuppeteerのページを指定して、PDFをエクスポートする
 */
export const exportPdf = ({
  lunchedPuppeteerPage,
  exportPathName,
  pdfOption,
  headerProps,
}: ExportPdfProps): Promise<void> => {

  return new Promise((resolve, reject) => {
    const format: PdfFormat | undefined = !pdfOption.width && !pdfOption.height ? pdfOption.format ?? 'A4' : undefined

    // ヘッダーの有無やフォントサイズによって、本文のマージンTopの計算
    const marginWithHeaderHeight = getMarginWithHeaderHeight({
      headerFontSize: headerProps.headerFontSize,
      headerMargin: pdfOption.margin,
      isDisplayHeaderAndFooter:pdfOption.isDisplayHeaderAndFooter
    })

    const options: PDFOptions = {
      path: exportPathName,
      scale: pdfOption.scale || 1,
      displayHeaderFooter: pdfOption.isDisplayHeaderAndFooter,
      headerTemplate: transformTemplate(header({
        headerItems: headerProps.headerItems,
        headerFontSize: headerProps.headerFontSize,
        headerMargin: {
          /**
           * ヘッダーのマージンは、PDFのマージンを使用し、
           * PDFのマージンは、marginWithHeaderHeight で計算した値を使用する
           * このことで、ヘッダーはマージン内に収まり、本文はそれを重ならないようにマージンを取る
           **/
          top: pdfOption.margin.top,
          right: pdfOption.margin.right,
          left: pdfOption.margin.left
        }
      })),
      footerTemplate: transformTemplate(pdfOption.footerTemplate),
      printBackground: pdfOption.isPrintBackground,
      landscape: pdfOption.orientationIsLandscape,
      pageRanges: pdfOption.pageRanges || '',
      format: format,
      width: pdfOption.width || '',
      height: pdfOption.height || '',
      margin: {
        top: marginWithHeaderHeight || '',
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

// ヘッダーのHTML -------------------------------------
type HeaderItems = "title" | "pageNumber" | "date" | "url"
type HeaderProps = {
  headerItems?: HeaderItems[]
  headerFontSize?: number
  headerMargin?: PDFOptions['margin']
}

/**
 * ヘッダーのHTML要素を生成する
 */
const header = ({
  headerItems =['title', 'pageNumber'],
  headerFontSize = 14,
  headerMargin
}: HeaderProps): string => {

  // ヘッダーのテンプレートに使用するマージンを計算する
  const m = getCalculatedHeaderMargin({headerMargin})

  // ヘッダーのテンプレートに使用するフォントサイズを計算する
  const fs = getCalculatedHeaderFontSize({headerFontSize})

  const itemsElement = headerItems.map((item, index) => {
    if (item === 'title') {
      return `<span class='title'></span>`
    }
    if (item === 'pageNumber') {
      return `<div><span class='pageNumber'></span> / <span class='totalPages'></span></div>`
    }
    if (item === 'date') {
      return `<span class='date'>%%ISO-DATE%%</span>`
    }
    if (item === 'url') {
      return `<span class='url'></span>`
    }
  })

  return `
  <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; margin: ${m.top}px ${m.right}px 0 ${m.left}px; font-size: ${fs}px;">
    ${itemsElement.join('\n')}
  </div>
  `
}

// ヘッダーのテンプレートに使用するマージン -------------------------------------
type CalcHeaderMarginProps = {
  headerMargin: HeaderProps['headerMargin']
}

/**
 * PDFのオプション指定のマージンからヘッダーのテンプレートに使用するマージンを計算する
 */
const getCalculatedHeaderMargin = ({headerMargin}: CalcHeaderMarginProps) => {
  const {
    top = '1cm',
    left = '1cm',
    right = '1cm'
  } = headerMargin ?? {}

  return {
    top: toPx(String(top)) - 16,
    right: toPx(String(left)),
    left: toPx(String(right))
  }
}

// ヘッダーフォントサイズ -------------------------------------
type GetCalculatedHeaderFontSizeProps = {
  headerFontSize?: HeaderProps['headerFontSize']
}

/**
 * ヘッダーのテンプレートに使用するフォントサイズを計算する
 */
const getCalculatedHeaderFontSize = ({
  headerFontSize = 14
}: GetCalculatedHeaderFontSizeProps) => {
  return headerFontSize * 0.75
}


// ヘッダーの有無やフォントサイズによって、本文のマージンTopの計算 -------------------------------------
type GetHeaderHeightProps = HeaderProps & {
  isDisplayHeaderAndFooter: PdfOption['isDisplayHeaderAndFooter']
}

/**
 * ヘッダーの有無やフォントサイズによって、本文のマージンTopの計算
 */
export const getMarginWithHeaderHeight = ({
  headerFontSize = 14,
  headerMargin,
  isDisplayHeaderAndFooter
}: GetHeaderHeightProps) => {
  // ヘッダーを表示しない場合はそのまま返す
  if (!isDisplayHeaderAndFooter) {
    return headerMargin?.top
  }

  // ヘッダーのテンプレートに使用するフォントサイズを計算する
  const px = getCalculatedHeaderFontSize({headerFontSize})

  // マージン指定のピクセル値を取得
  const pdfMt = toPx(String(headerMargin?.top ?? '1cm'))

  return `${(pdfMt + (px * FONTSIZE_TO_HEIGHT_RATE)) / CM_TO_PX_RATE}cm` 

}

const toPx = (value: string):number => {
  // 単位と数値を抽出
  const match = value.match(/^(\d+(?:\.\d+)?)(cm|mm|in)$/)
  if (!match) {
    return parseFloat(value)
  }

  const num = parseFloat(match[1])
  const unit = match[2]

  // 単位に応じてピクセル値に変換
  switch (unit) {
    case 'cm':
      return num * CM_TO_PX_RATE
    case 'mm':
      return num * CM_TO_PX_RATE / 10
    case 'in':
      return num * CM_TO_PX_RATE * 2.54
    default:
      return num
  }
}