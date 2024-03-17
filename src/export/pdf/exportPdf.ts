import { PDFOptions } from "puppeteer"
import { LunchedPuppeteer } from "../../lunchPuppeteer"
import { PdfHeaderProps, getMarginWithHeaderHeight, pdfHeader } from "./pdfHeader"
import { pdfFooter, getMarginWitFooterHeight, PdfFooterProps } from "./pdfFooter"



export type PuppeteerPdfOutputType = "pdf"

export type PdfFormat = "Letter" | "Legal" | "Tabloid" | "Ledger" | "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6"
export type PdfOrientation = "portrait" | "landscape"

export type PdfOption = {
  /** スケール */
  scale: number | undefined

  /** ヘッダー・フッターの表示 */
  isDisplayHeaderAndFooter: boolean

  /** ヘッダーテンプレート */
  headerTemplate: string

  /** フッターテンプレート */
  footerTemplate: string

  /** 背景の印刷 */
  isPrintBackground: boolean

  /** 横向きの場合はtrue */
  orientationIsLandscape: boolean

  /** ページ範囲 */
  pageRanges: string

  /** ページのフォーマット */
  format?: PdfFormat

  /** 幅 */
  width: string

  /** 高さ */
  height: string

  /** マージン */
  margin: {
    /** 上マージン */
    top: string

    /** 右マージン */
    right: string

    /** 下マージン */
    bottom: string

    /** 左マージン */
    left: string
  }
}

export type ExportPdfProps = {
  /** ランチ済のPuppeteerのページ */
  lunchedPuppeteerPage: LunchedPuppeteer['page']

  /** エクスポートパスファイル */
  exportPathName: string

  /** PDFのオプション */
  pdfOption: PdfOption
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
    const format: PdfFormat | undefined = !pdfOption.width && !pdfOption.height ? pdfOption.format ?? 'A4' : undefined

    // ヘッダーの有無やフォントサイズによって、本文のマージンTopの計算
    const marginWithHeaderHeight = getMarginWithHeaderHeight({
      fontSize: headerProps.fontSize,
      pdfMargin: pdfOption.margin,
      isDisplayHeaderAndFooter:pdfOption.isDisplayHeaderAndFooter
    })

    const marginWithFooterHeight =  getMarginWitFooterHeight({
      fontSize: headerProps.fontSize,
      pdfMargin: pdfOption.margin,
      isDisplayHeaderAndFooter:pdfOption.isDisplayHeaderAndFooter
    })

    console.log(`marginWithHeaderHeight: ${marginWithHeaderHeight}, marginWithFooterHeight: ${marginWithFooterHeight}`)

    const options: PDFOptions = {
      path: exportPathName,
      scale: pdfOption.scale || 1,
      displayHeaderFooter: pdfOption.isDisplayHeaderAndFooter,
      headerTemplate: transformTemplate(pdfHeader({
        headerItems: headerProps.headerItems,
        fontSize: headerProps.fontSize,
        pdfMargin: pdfOption.margin
      })),
      footerTemplate: transformTemplate(pdfFooter({
        footerItems: footerProps.footerItems,
        fontSize: footerProps.fontSize,
        pdfMargin: pdfOption.margin
      })),
      printBackground: pdfOption.isPrintBackground,
      landscape: pdfOption.orientationIsLandscape,
      pageRanges: pdfOption.pageRanges || '',
      format: format,
      width: pdfOption.width || '',
      height: pdfOption.height || '',
      margin: {
        top: marginWithHeaderHeight || '',
        right: pdfOption.margin.right || '',
        bottom: marginWithFooterHeight || '',
        left: pdfOption.margin.left || ''
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

export const transformTemplate = (templateText: string) => {
  if (templateText.indexOf('%%ISO-DATETIME%%') !== -1) {
    templateText = templateText.replace('%%ISO-DATETIME%%', new Date().toISOString().substr(0, 19).replace('T', ' '))
  }
  if (templateText.indexOf('%%ISO-DATE%%') !== -1) {
    templateText = templateText.replace('%%ISO-DATE%%', new Date().toISOString().substr(0, 10))
  }
  if (templateText.indexOf('%%ISO-TIME%%') !== -1) {
    templateText = templateText.replace('%%ISO-TIME%%', new Date().toISOString().substr(11, 8))
  }

  return templateText
}

