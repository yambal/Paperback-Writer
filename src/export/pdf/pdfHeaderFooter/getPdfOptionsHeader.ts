import { PDFOptions } from "puppeteer"
import {
  CM_TO_PX_RATE,
  HeaderFooterItems,
  getCalculatedHeaderFooterTemplateFontSize,
  getCalculatedHeaderMargin,
  toPx
} from "./pdfHeaderFooterUtil"

export type PdfHeaderProps = PdfHeaderTemplateProps & GetHeaderHeightProps
export type PdfOptionsHeader = {
  PDFOptionsHeaderTemplate: string
  pdfOptionsMarginTop: string | number | undefined
}

export const getPdfOptionsHeader = ({
  headerItems,
  hederFontSize,
  pdfMargin,
  headerMargin,
  isDisplayHeaderAndFooter
}: PdfHeaderProps): PdfOptionsHeader => {
  const PDFOptionsHeaderTemplate = pdfHeaderTemplate({
    headerItems,
    hederFontSize,
    pdfMargin,
  })
  const pdfOptionsMarginTop = getMarginWithHeaderHeight({
    hederFontSize,
    pdfMargin,
    headerMargin,
    isDisplayHeaderAndFooter,
  })

  return {
    PDFOptionsHeaderTemplate,
    pdfOptionsMarginTop
  }
}

// ヘッダーのHTML -------------------------------------

type PdfHeaderTemplateProps = {
  headerItems: HeaderFooterItems[]
  hederFontSize: number
  pdfMargin: PDFOptions['margin']
}

/**
 * ヘッダーのHTML要素を生成する
 */
const pdfHeaderTemplate = ({
  headerItems,
  hederFontSize,
  pdfMargin
}: PdfHeaderTemplateProps): string => {

  // ヘッダーのテンプレートに使用するマージンを計算する
  const m = getCalculatedHeaderMargin({pdfMargin})

  // ヘッダーのテンプレートに使用するフォントサイズを計算する
  const fs = getCalculatedHeaderFooterTemplateFontSize({fontSize: hederFontSize})

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

  const pdfOptionsHeaderTemplate = `
  <div style="width: 100%; display: flex; justify-content: ${justify}; align-items: center; margin: ${m.top}px ${m.right}px 0 ${m.left}px; font-size: ${fs}px;">
    ${itemsElement.join('\n')}
  </div>
  `

  return pdfOptionsHeaderTemplate
}

// ヘッダーの有無やフォントサイズによって、本文のマージンTopの計算 -------------------------------------
type GetHeaderHeightProps = {
  hederFontSize?: number
  isDisplayHeaderAndFooter: PDFOptions['displayHeaderFooter']
  headerMargin: string
  pdfMargin?: PDFOptions['margin']
}

/**
 * ヘッダーの有無やフォントサイズによって、本文のマージンTopの計算
 */
const getMarginWithHeaderHeight = ({
  hederFontSize = 14,
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

  return `${(pdfMt + hederFontSize + headerMarginPx) / CM_TO_PX_RATE}cm` 
}

