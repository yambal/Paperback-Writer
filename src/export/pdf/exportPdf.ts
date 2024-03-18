import { PDFOptions, PaperFormat } from "puppeteer"
import { LunchedPuppeteer } from "../../lunchPuppeteer"
import { PdfHeaderProps, getMarginWithHeaderHeight, pdfHeader } from "./pdfHeader"
import { pdfFooter, getMarginWitFooterHeight, PdfFooterProps } from "./pdfFooter"

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
  headerProps: Omit<PdfHeaderProps, "pdfMargin">,
  footerProps: Omit<PdfFooterProps, "pdfMargin">,
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
    const marginWithHeaderHeight = getMarginWithHeaderHeight({
      fontSize: headerProps.fontSize,
      headerMargin: headerProps.headerMargin,
      pdfMargin: pdfOption.margin,
      isDisplayHeaderAndFooter:pdfOption.displayHeaderFooter
    })

    const marginWithFooterHeight =  getMarginWitFooterHeight({
      fontSize: headerProps.fontSize,
      footerMargin: footerProps.footerMargin,
      pdfMargin: pdfOption.margin,
      isDisplayHeaderAndFooter:pdfOption.displayHeaderFooter
    })

    console.log(`marginWithHeaderHeight: ${marginWithHeaderHeight}, marginWithFooterHeight: ${marginWithFooterHeight}`)

    const options: PDFOptions = {
      path: exportPathName,
      scale: pdfOption.scale || 1,
      displayHeaderFooter: pdfOption.displayHeaderFooter,
      headerTemplate: pdfHeader({
        headerItems: headerProps.headerItems,
        fontSize: headerProps.fontSize,
        headerMargin: headerProps.headerMargin,
        pdfMargin: pdfOption.margin
      }),
      footerTemplate: pdfFooter({
        footerItems: footerProps.footerItems,
        fontSize: footerProps.fontSize,
        footerMargin: footerProps.footerMargin,
        pdfMargin: pdfOption.margin
      }),
      printBackground: pdfOption.printBackground,
      landscape: pdfOption.landscape,
      pageRanges: pdfOption.pageRanges || '',
      format: format,
      width: pdfOption.width,
      height: pdfOption.height,
      margin: {
        top: marginWithHeaderHeight || '',
        right: pdfOption.margin?.right || '',
        bottom: marginWithFooterHeight || '',
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
