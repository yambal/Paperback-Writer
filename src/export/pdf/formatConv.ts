import { PDFOptions, PaperFormat } from "puppeteer"

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

export type FormatConvProps = {
  /** 拡張機能では、Puppeteer で期待されたものの他に、空白とundefinedを許容する */
  inFormat?: PaperFormat | "",
  inWidth?: PDFOptions['width'],
  inHeight?: PDFOptions['height']
}

type PdfFormatWidthHeight = {
  format: PDFOptions['format']
  width: PDFOptions['width'],
  height: PDFOptions['height']
}

export const pdfFormatPolicy = ({
  inFormat,
  inWidth,
  inHeight
}:FormatConvProps):PdfFormatWidthHeight  => {
  
  // オフィシャルなPaperFormatに変換する、変換できない場合はundefinedを返す
  const sanitizedPaperFormat = getSanitizedPaperFormat(inFormat)

  // オフィシャルなPaperFormatである場合は、width, height は無視する
  if (sanitizedPaperFormat) {
    return {
      format: sanitizedPaperFormat,
      width: undefined,
      height: undefined
    }
  }

  // Formatが正しくないが、width, height も正しくない場合は、A4 とする
  if (!isValiable(inWidth) || !isValiable(inHeight)) {
    return {
      format: 'A4',
      width: undefined,
      height: undefined
    }
  }

  // Formatが正しくないが、width, height が正しいと思われるときは、width, height を優先する
  return {
    format: undefined,
    width: inWidth,
    height: inHeight
  }
}