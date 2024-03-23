import { PDFOptions, PaperFormat } from "puppeteer"
import { CustomPDFOptions } from "./exportPdf"
import { toPx } from "./pdfHeaderFooter/pdfHeaderFooterUtil"

/**
puppeteer supports the following paper formats:
- `Letter`: 8.5in x 11in
- `Legal`: 8.5in x 14in
- `Tabloid`: 11in x 17in
- `Ledger`: 17in x 11in
- `A0`: 33.1in x 46.8in
- `A1`: 23.4in x 33.1in
- `A2`: 16.54in x 23.4in
- `A3`: 11.7in x 16.54in
- `A4`: 8.27in x 11.7in
- `A5`: 5.83in x 8.27in
- `A6`: 4.13in x 5.83in
 */
const paperFormats: PaperFormat[] = [
  'Letter',
  'Legal',
  'Tabloid',
  'Ledger',
  'A0',
  'A1',
  'A2',
  'A3',
  'A4',
  'A5',
  'A6'
]

// その値が有効かどうか（undefine, null, 空文字, Nanではない）を判定する
const isValiable = (val?: string | number | null) => {
  if (val === undefined || val === null) {
    return false
  }
  if (typeof val === 'number' && Number.isNaN(val)) {
    return false
  }
  if (typeof val === 'string' && (!val || val.length === 0)) {
    return false
  }
  return true
}

/**
 * オフィシャルなPaperFormatに変換する、変換できない場合はundefinedを返す
 */
const getSanitizedPaperFormat = (format?: any): PaperFormat | undefined  => {
  if (isValiable(format)) {
    return undefined
  }
  if (typeof format !== 'string') {
    return undefined
  }
  const hit = paperFormats.filter((paperFormat) => {
    return paperFormat.toLocaleLowerCase() === format.toLocaleLowerCase()
  })
  if (hit.length === 0) {
    return undefined
  }
  return hit[0]
}

// もし規定より小さければ既定の値を返す
const returnDefaultValueIfBelowThreshold = (minimumValue: string, testValue: string) => {
  return toPx(minimumValue) > toPx(testValue) ? minimumValue : testValue
}

// 独自拡張したPDFオプションのうち、width, height, format, margin をオフィシャルなオプションに変換する -----------------------
export type FormatConvProps = {
  /** 拡張機能では、Puppeteer で期待されたものの他に、空白とundefinedを許容する */
  customPDFOptionsFormat?: CustomPDFOptions['format'],
  customPDFOptionsWidth?: CustomPDFOptions['width'],
  customPDFOptionsHeight?: CustomPDFOptions['height']
  customPDFOptionsMargin: CustomPDFOptions['margin']
}

type PDFOptionsPageSettings = {
  PDFOptionsPaperFormat: PDFOptions['format']
  PDFOptionsWidth: PDFOptions['width'],
  PDFOptionsHeight: PDFOptions['height']
  PDFOptionsMargin: PDFOptions['margin']
}

/**
 * 独自拡張したPDFオプションのうち、width, height, format, margin をオフィシャルなオプションに変換する
 */
export const convertCustomPdfOptionsToOfficial = ({
  customPDFOptionsFormat,
  customPDFOptionsWidth,
  customPDFOptionsHeight,
  customPDFOptionsMargin
}:FormatConvProps): PDFOptionsPageSettings  => {
  
  // オフィシャルなPaperFormatに変換する、変換できない場合はundefinedを返す
  const sanitizedPaperFormat = getSanitizedPaperFormat(customPDFOptionsFormat)

  const margin: PDFOptions['margin'] = {
    top: customPDFOptionsMargin.vertical,
    right: customPDFOptionsMargin.horizontal,
    bottom: customPDFOptionsMargin.vertical,
    left: customPDFOptionsMargin.horizontal
  }

  // 日本の郵便はがき
  if (customPDFOptionsFormat === 'Japanese Postcard 100x148') {
    return {
      PDFOptionsPaperFormat: undefined,
      PDFOptionsWidth: "10.0cm",
      PDFOptionsHeight: "14.8m",
      PDFOptionsMargin: margin
    }
  }

  /**
   * Kindle Direct Publishing (KDP) でのペーパーバック
   * サイズだけではなく、マージンも指定する
   * @see https://kdp.amazon.co.jp/ja_JP/help/topic/GVBQ3CMEQW3W2VL6#margins
   */

  // kdp.amazon.com / 
  if (customPDFOptionsFormat === 'KDP-PB 139.7x215.9 no bleed') {
    const horizontalMargin = returnDefaultValueIfBelowThreshold("9.6mm", customPDFOptionsMargin.horizontal)
    const verticalMargin = returnDefaultValueIfBelowThreshold("6.4mm", customPDFOptionsMargin.vertical)
    return {
      PDFOptionsPaperFormat: undefined,
      PDFOptionsWidth: "13.97cm",
      PDFOptionsHeight: "21.59cm",
      PDFOptionsMargin: {
        top: verticalMargin,
        right: horizontalMargin,
        bottom: verticalMargin,
        left: horizontalMargin
      }
    }

  }

  if (customPDFOptionsFormat === 'KDP-PB (JP) 148x210 no bleed'){
    // 規定より小さければ既定のマージンを返す（最低マージンを保証する）
    const horizontalMargin = returnDefaultValueIfBelowThreshold("9.6mm", customPDFOptionsMargin.horizontal)
    const verticalMargin = returnDefaultValueIfBelowThreshold("6.4mm", customPDFOptionsMargin.vertical)
    return {
      PDFOptionsPaperFormat: undefined,
      PDFOptionsWidth: "14.8cm",
      PDFOptionsHeight: "21.0cm",
      PDFOptionsMargin: {
        top: verticalMargin,
        right: horizontalMargin,
        bottom: verticalMargin,
        left: horizontalMargin
      }
    }
  }

  // オフィシャルなPaperFormatである場合は、width, height は無視する
  if (sanitizedPaperFormat) {
    return {
      PDFOptionsPaperFormat: sanitizedPaperFormat,
      PDFOptionsWidth: undefined,
      PDFOptionsHeight: undefined,
      PDFOptionsMargin: margin
    }
  }

  // Formatが正しくないが、width, height も正しくない場合は、A4 とする
  if (!isValiable(customPDFOptionsWidth) || !isValiable(customPDFOptionsHeight)) {
    return {
      PDFOptionsPaperFormat: 'A4',
      PDFOptionsWidth: undefined,
      PDFOptionsHeight: undefined,
      PDFOptionsMargin: margin
    }
  }

  // Formatが正しくないが、width, height が正しいと思われるときは、width, height を優先する
  return {
    PDFOptionsPaperFormat: undefined,
    PDFOptionsWidth: customPDFOptionsWidth,
    PDFOptionsHeight: customPDFOptionsHeight,
    PDFOptionsMargin: margin
  }
}