import { PdfOption } from "./exportPdf"
import { HeaderFooterItems, getCalculatedFontSize, getCalculatedHeaderMargin, toPx } from "./pdfHeaderFooterUtil"
import { FONTSIZE_TO_HEIGHT_RATE, CM_TO_PX_RATE } from "./pdfHeaderFooterUtil"

// ヘッダーのHTML -------------------------------------

export type PdfHeaderProps = {
  headerItems?: HeaderFooterItems[]
  fontSize?: number
  pdfMargin?: PdfOption['margin']
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
  const fs = getCalculatedFontSize({fontSize})

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

// ヘッダーの有無やフォントサイズによって、本文のマージンTopの計算 -------------------------------------
type GetHeaderHeightProps = PdfHeaderProps & {
  isDisplayHeaderAndFooter: PdfOption['isDisplayHeaderAndFooter']
}

/**
 * ヘッダーの有無やフォントサイズによって、本文のマージンTopの計算
 */
export const getMarginWithHeaderHeight = ({
  fontSize = 14,
  pdfMargin,
  isDisplayHeaderAndFooter
}: GetHeaderHeightProps) => {
  // ヘッダーを表示しない場合はそのまま返す
  if (!isDisplayHeaderAndFooter) {
    return pdfMargin?.top
  }

  // ヘッダーのテンプレートに使用するフォントサイズを計算する
  const px = getCalculatedFontSize({fontSize})

  // マージン指定のピクセル値を取得
  const pdfMt = toPx(String(pdfMargin?.top ?? '1cm'))

  return `${(pdfMt + (px * FONTSIZE_TO_HEIGHT_RATE)) / CM_TO_PX_RATE}cm` 

}

