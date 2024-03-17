import { PDFOptions } from "puppeteer"

export const CM_TO_PX_RATE = 28

export type HeaderFooterItems = "title" | "pageNumber" | "date" | "url"

type GetCalculatedFontSizeProps = {
  fontSize?: number
}

/**
 * ヘッダーのテンプレートに使用するフォントサイズを計算する
 */
export const getCalculatedHeaderFooterTemplateFontSize = ({
  fontSize = 14
}: GetCalculatedFontSizeProps) => {
  return fontSize * 0.75
}


// ヘッダーのテンプレートに使用するマージン -------------------------------------
type CalcHeaderMarginProps = {
  pdfMargin?: PDFOptions['margin']
}

/**
 * PDFのオプション指定のマージンからヘッダーのテンプレートに使用するマージンを計算する
 */
export const getCalculatedHeaderMargin = ({pdfMargin}: CalcHeaderMarginProps) => {
  const {
    top = '1cm',
    left = '1cm',
    right = '1cm',
    bottom = '1cm'
  } = pdfMargin ?? {}

  return {
    top: toPx(String(top)) - 16,
    right: toPx(String(left)),
    left: toPx(String(right)),
    bottom: toPx(String(bottom)) -16
  }
}

export const toPx = (value: string):number => {
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


type GetHeaderFooterFontSizeProps = {
  baseFontSize: number
  rate: string
}
/**
 * 本文のフォントサイズの何％をヘッダー・フッターのフォントサイズとするかを計算する
 */
export const getHeaderFooterFontSize = ({baseFontSize, rate}: GetHeaderFooterFontSizeProps) => {
  const res = Math.round(parseInt(rate) / 100 * baseFontSize)
  console.log(`getHeaderFooterFontSize: ${res}`)
  return res
}

