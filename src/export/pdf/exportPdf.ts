import { PDFOptions, PaperFormat } from "puppeteer"
import { LunchedPuppeteer } from "../../lunchPuppeteer"
import { PdfHeaderProps } from "./pdfHeaderFooter/getPdfOptionsHeader"
import { PdfFooterProps } from "./pdfHeaderFooter/getPdfOptionsFooter"
import { generateHeaderFooterTemplatesAndMargins } from "./pdfHeaderFooter/generateHeaderFooterTemplatesAndMargins"
import { convertCustomPdfOptionsToOfficial } from "./convertCustomPdfOptionsToOfficial"

export type PuppeteerPdfOutputType = "pdf"
export type PdfOrientation = "portrait" | "landscape"

export type CustomPaperFormat = "" |
PaperFormat |
"Japanese Postcard 100x148" |
"KDP-PB 139.7x215.9 no bleed" |
"KDP-PB (JP) 148x210 no bleed" 

export type CustomPDFOptions = Omit<PDFOptions, "margin" | "format"> & {
  format: CustomPaperFormat
  margin: {
    vertical: string
    horizontal: string
  }
}

export type ExportPdfProps = {
  /** ランチ済のPuppeteerのページ */
  lunchedPuppeteerPage: LunchedPuppeteer['page']

  /** エクスポートパスファイル */
  exportPathName: string

  /** PDFのオプション */
  customPDFOptions: CustomPDFOptions
} & {
  headerProps: {
    headerItems: PdfHeaderProps['headerItems']
    headerMargin: PdfHeaderProps['headerMargin']
    hederFontSize: PdfHeaderProps['hederFontSize']
  }
  footerProps: {
    footerItems: PdfFooterProps['footerItems']
    footerMargin: PdfFooterProps['footerMargin']
    footerFontSize: PdfFooterProps['footerFontSize']
  }
}

/**
 * ランチ済のPuppeteerのページを指定して、PDFをエクスポートする
 */
export const exportPdf = ({
  lunchedPuppeteerPage,
  exportPathName,
  customPDFOptions,
  headerProps,
  footerProps
}: ExportPdfProps): Promise<void> => {

  return new Promise((resolve, reject) => {

    // 独自拡張したPDFオプションのうち、width, height, format, margin をオフィシャルなオプションに変換する
    const {
      PDFOptionsPaperFormat,
      PDFOptionsWidth,
      PDFOptionsHeight,
      PDFOptionsMargin
    } = convertCustomPdfOptionsToOfficial({
      customPDFOptionsFormat: customPDFOptions.format,
      customPDFOptionsWidth: customPDFOptions.width,
      customPDFOptionsHeight: customPDFOptions.height,
      customPDFOptionsMargin: customPDFOptions.margin
    })

    // ヘッダーとフッターのテンプレートを生成し、必要なマージンも算出する
    const {
      PDFOptionsHeaderTemplate,
      PDFOptionsFooterTemplate,
      PDFOptionsMarginWithHeaderFooter
    } = generateHeaderFooterTemplatesAndMargins({
      headerItems: headerProps.headerItems,
      headerMargin: headerProps.headerMargin,
      footerItems: footerProps.footerItems,
      footerMargin: footerProps.footerMargin,
      hederFontSize: headerProps.hederFontSize,
      footerFontSize: footerProps.footerFontSize,
      pdfMargin: PDFOptionsMargin,
      isDisplayHeaderAndFooter: customPDFOptions.displayHeaderFooter
    })

    // 最終的なPDFオプション
    const options: PDFOptions = {
      path: exportPathName,
      scale: customPDFOptions.scale || 1,
      displayHeaderFooter: customPDFOptions.displayHeaderFooter,
      headerTemplate: PDFOptionsHeaderTemplate,
      footerTemplate: PDFOptionsFooterTemplate,
      printBackground: customPDFOptions.printBackground,
      landscape: customPDFOptions.landscape,
      pageRanges: customPDFOptions.pageRanges || '',
      format: PDFOptionsPaperFormat,
      width: PDFOptionsWidth,
      height: PDFOptionsHeight,
      margin: PDFOptionsMarginWithHeaderFooter,
      timeout: 0
    }

    console.log('options', JSON.stringify(options, null, 2))

    /** PDF化 */
    return lunchedPuppeteerPage.pdf(options)
    .then(() => {
      resolve()
    })
    .catch((error: any) => {
      reject(error)
    })
  })
}
