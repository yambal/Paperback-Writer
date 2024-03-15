import { PdfOption } from "./exportPdf"
import { CM_TO_PX_RATE, FONTSIZE_TO_HEIGHT_RATE, HeaderFooterItems, getCalculatedHeaderMargin, toPx } from "./pdfHeaderFooterUtil"
import { getCalculatedFontSize } from "./pdfHeaderFooterUtil"

export type PdfFooterProps = {
  footerItems?: HeaderFooterItems[]
  fontSize?: number
  pdfMargin?: PdfOption['margin']
}

export const pdfFooter = ({
  footerItems =['title', 'pageNumber'],
  fontSize = 14,
  pdfMargin
}: PdfFooterProps) => {

  const m = getCalculatedHeaderMargin({pdfMargin})

  const fs = getCalculatedFontSize({fontSize})

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

  return `
  <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; margin: 0 ${m.right}px ${m.bottom}px ${m.left}px; font-size: ${fs}px;">
    <div>left</div>
    <div>center</div>
    <div>light</div>
  </div>
`
}

// ヘッダーの有無やフォントサイズによって、本文のマージンTopの計算 -------------------------------------
type GetMarginWitFooterHeightProps = PdfFooterProps & {
  isDisplayHeaderAndFooter: PdfOption['isDisplayHeaderAndFooter']
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

  // ヘッダーのテンプレートに使用するフォントサイズを計算する
  const px = getCalculatedFontSize({fontSize})

  // マージン指定のピクセル値を取得
  const pdfMt = toPx(String(pdfMargin?.bottom ?? '1cm'))

  return `${(pdfMt + (px * FONTSIZE_TO_HEIGHT_RATE)) / CM_TO_PX_RATE}cm` 

}