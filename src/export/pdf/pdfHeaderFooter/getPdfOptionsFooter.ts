import { PDFOptions } from "puppeteer"
import {
  CM_TO_PX_RATE,
  HeaderFooterFontSize,
  HeaderFooterItems,
  getCalculatedHeaderFooterTemplateFontSize,
  getCalculatedHeaderMargin,
  toPx
} from "./pdfHeaderFooterUtil"

export type PdfFooterProps = PdfFooterTemplateProps & GetMarginWitFooterHeightProps
export type PdfOptionsFooter = {
  PDFOptionsFooterTemplate: string
  pdfOptionsMarginBottom: string | number | undefined
}

export const getPdfOptionsFooter = ({
  footerItems,
  footerFontSize,
  pdfMargin,
  footerMargin,
  isDisplayHeaderAndFooter
}: PdfFooterProps): PdfOptionsFooter => {
  const PDFOptionsFooterTemplate = pdfFooterTemplate({
    footerItems,
    footerFontSize,
    pdfMargin,
  })

  const pdfOptionsMarginBottom = getMarginWitFooterHeight({
    footerFontSize,
    pdfMargin,
    footerMargin,
    isDisplayHeaderAndFooter,
  })

  return {
    PDFOptionsFooterTemplate,
    pdfOptionsMarginBottom
  }
}

export type PdfFooterTemplateProps = {
  footerItems: HeaderFooterItems[]
  footerFontSize: HeaderFooterFontSize
  pdfMargin?: PDFOptions['margin']
}

export const pdfFooterTemplate = ({
  footerItems,
  footerFontSize,
  pdfMargin,
}: PdfFooterTemplateProps): string => {

  const m = getCalculatedHeaderMargin({pdfMargin})

  const fs = getCalculatedHeaderFooterTemplateFontSize({fontSize: footerFontSize})

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

  const pdfOptionsFooterTemplate = `
  <div style="width: 100%; display: flex; justify-content: ${justify}; align-items: center; margin: 0 ${m.right}px ${m.bottom}px ${m.left}px; font-size: ${fs}px;">
    ${itemsElement.join('\n')}
  </div>
  `

  return pdfOptionsFooterTemplate
}

// ヘッダーの有無やフォントサイズによって、本文のマージンTopの計算 -------------------------------------
type GetMarginWitFooterHeightProps = {
  isDisplayHeaderAndFooter: PDFOptions['displayHeaderFooter']
  footerMargin: string
  pdfMargin: PDFOptions['margin']
  footerFontSize?: HeaderFooterFontSize
}

/**
 * ヘッダーの有無やフォントサイズによって、本文のマージンTopの計算
 */
const getMarginWitFooterHeight = ({
  footerFontSize = 14,
  pdfMargin,
  footerMargin,
  isDisplayHeaderAndFooter
}: GetMarginWitFooterHeightProps) => {
  // ヘッダーを表示しない場合はそのまま返す
  if (!isDisplayHeaderAndFooter) {
    return pdfMargin?.top
  }

  const mb = pdfMargin?.bottom ? String(pdfMargin.bottom) : '1cm'

  const footerMarginPx = toPx(footerMargin)
  const pdfMb = toPx(mb)

  return `${(pdfMb + footerFontSize + footerMarginPx) / CM_TO_PX_RATE}cm` 

}