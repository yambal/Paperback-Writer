import { PDFOptions, PaperFormat } from "puppeteer"
import { LunchedPuppeteer } from "../../lunchPuppeteer"
import { PdfHeaderProps } from "./pdfHeaderFooter/getPdfOptionsHeader"
import { PdfFooterProps } from "./pdfHeaderFooter/getPdfOptionsFooter"
import { getPdfOptionsHeaderFooter } from "./pdfHeaderFooter/getPdfOptionsHeaderFooter"

export type PuppeteerPdfOutputType = "pdf"
export type PdfOrientation = "portrait" | "landscape"

export type ExportPdfProps = {
  /** ランチ済のPuppeteerのページ */
  lunchedPuppeteerPage: LunchedPuppeteer['page']

  /** エクスポートパスファイル */
  exportPathName: string

  /** PDFのオプション */
  pdfOption: PDFOptions
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
  pdfOption,
  headerProps,
  footerProps
}: ExportPdfProps): Promise<void> => {

  return new Promise((resolve, reject) => {
    const format: PaperFormat | undefined = !pdfOption.width && !pdfOption.height ? pdfOption.format ?? 'A4' : undefined

    // ヘッダーの有無やフォントサイズによって、本文のマージンTopの計算
    const {
      pdfOptionsHeaderTemplate,
      pdfOptionsMarginTop,
      pdfOptionsFooterTemplate,
      pdfOptionsMarginBottom
    } = getPdfOptionsHeaderFooter({
      headerItems: headerProps.headerItems,
      headerMargin: headerProps.headerMargin,
      footerItems: footerProps.footerItems,
      footerMargin: footerProps.footerMargin,
      hederFontSize: headerProps.hederFontSize,
      footerFontSize: footerProps.footerFontSize,
      pdfMargin: pdfOption.margin,
      isDisplayHeaderAndFooter: pdfOption.displayHeaderFooter
    })

    const options: PDFOptions = {
      path: exportPathName,
      scale: pdfOption.scale || 1,
      displayHeaderFooter: pdfOption.displayHeaderFooter,
      headerTemplate: pdfOptionsHeaderTemplate,
      footerTemplate: pdfOptionsFooterTemplate,
      printBackground: pdfOption.printBackground,
      landscape: pdfOption.landscape,
      pageRanges: pdfOption.pageRanges || '',
      format: format,
      width: pdfOption.width,
      height: pdfOption.height,
      margin: {
        top: pdfOptionsMarginTop || '',
        right: pdfOption.margin?.right || '',
        bottom: pdfOptionsMarginBottom || '',
        left: pdfOption.margin?.left || ''
      },
      timeout: 0
    }

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
