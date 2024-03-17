import { PDFOptions } from "puppeteer"
import {
  CM_TO_PX_RATE,
  HeaderFooterItems,
  getCalculatedHeaderFooterTemplateFontSize,
  getCalculatedHeaderMargin,
  toPx
} from "./pdfHeaderFooterUtil"

export type PdfFooterProps = {
  footerItems?: HeaderFooterItems[]
  fontSize?: number
  pdfMargin?: PDFOptions['margin']
}

export const pdfFooter = ({
  footerItems =['title', 'pageNumber'],
  fontSize = 14,
  pdfMargin
}: PdfFooterProps) => {

  const m = getCalculatedHeaderMargin({pdfMargin})

  const fs = getCalculatedHeaderFooterTemplateFontSize({fontSize})

  const itemsElement = footerItems.map((item, index) => {
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

  const justify = footerItems.length === 1 ? 'center' : 'space-between'

  console.log(`m.bottom: ${m.bottom}`)

  return `
  <div style="width: 100%; display: flex; justify-content: ${justify}; align-items: center; margin: 0 ${m.right}px ${m.bottom}px ${m.left}px; font-size: ${fs}px;">
    ${itemsElement.join('\n')}
  </div>
  `

}

// ヘッダーの有無やフォントサイズによって、本文のマージンTopの計算 -------------------------------------
type GetMarginWitFooterHeightProps = PdfFooterProps & {
  isDisplayHeaderAndFooter: PDFOptions['displayHeaderFooter']
}

/**
 * ヘッダーの有無やフォントサイズによって、本文のマージンTopの計算
 */
export const getMarginWitFooterHeight = ({
  fontSize = 14,
  pdfMargin,
  isDisplayHeaderAndFooter
}: GetMarginWitFooterHeightProps) => {
  // ヘッダーを表示しない場合はそのまま返す
  if (!isDisplayHeaderAndFooter) {
    return pdfMargin?.top
  }

  const pdfMb = toPx(String(pdfMargin?.bottom ?? '1cm'))

  return `${(pdfMb + fontSize) / CM_TO_PX_RATE}cm` 

}