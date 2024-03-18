import { PDFOptions } from "puppeteer"
import {
  CM_TO_PX_RATE,
  HeaderFooterItems,
  getCalculatedHeaderFooterTemplateFontSize,
  getCalculatedHeaderMargin,
  toPx
} from "./pdfHeaderFooterUtil"

// ヘッダーのHTML -------------------------------------

export type PdfHeaderProps = {
  headerItems?: HeaderFooterItems[]
  headerMargin: string,
  fontSize?: number
  pdfMargin?: PDFOptions['margin']
}

/**
 * ヘッダーのHTML要素を生成する
 */
export const pdfHeader = ({
  headerItems =['title', 'pageNumber'],
  fontSize = 14,
  pdfMargin
}: PdfHeaderProps): string => {

  // ヘッダーのテンプレートに使用するマージンを計算する
  const m = getCalculatedHeaderMargin({pdfMargin})

  // ヘッダーのテンプレートに使用するフォントサイズを計算する
  const fs = getCalculatedHeaderFooterTemplateFontSize({fontSize})

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

  const justify = headerItems.length === 1 ? 'center' : 'space-between'

  return `
  <div style="width: 100%; display: flex; justify-content: ${justify}; align-items: center; margin: ${m.top}px ${m.right}px 0 ${m.left}px; font-size: ${fs}px;">
    ${itemsElement.join('\n')}
  </div>
  `
}

// ヘッダーの有無やフォントサイズによって、本文のマージンTopの計算 -------------------------------------
type GetHeaderHeightProps = PdfHeaderProps & {
  isDisplayHeaderAndFooter: PDFOptions['displayHeaderFooter']
  headerMargin: string
}

/**
 * ヘッダーの有無やフォントサイズによって、本文のマージンTopの計算
 */
export const getMarginWithHeaderHeight = ({
  fontSize = 14,
  pdfMargin,
  headerMargin,
  isDisplayHeaderAndFooter
}: GetHeaderHeightProps) => {
  // ヘッダーを表示しない場合はそのまま返す
  if (!isDisplayHeaderAndFooter) {
    return pdfMargin?.top
  }

  const mt = pdfMargin?.top ? String(pdfMargin.top) : '1cm'

  const pdfMt = toPx(mt)
  const headerMarginPx = toPx(headerMargin)

  return `${(pdfMt + fontSize + headerMarginPx) / CM_TO_PX_RATE}cm` 
}

