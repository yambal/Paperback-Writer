import { PDFOptions } from "puppeteer"
import { PdfOption } from "./exportPdf"

const CM_TO_PX_RATE = 28
const FONTSIZE_TO_HEIGHT_RATE = 1.15

// ヘッダーのHTML -------------------------------------
type HeaderItems = "title" | "pageNumber" | "date" | "url"
export type HeaderProps = {
  headerItems?: HeaderItems[]
  headerFontSize?: number
  headerMargin?: PDFOptions['margin']
}

/**
 * ヘッダーのHTML要素を生成する
 */
export const pdfHeader = ({
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