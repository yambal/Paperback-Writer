import { PDFOptions } from "puppeteer"
import { PdfHeaderProps, PdfOptionsHeader, getPdfOptionsHeader } from "./getPdfOptionsHeader"
import { PdfFooterProps, PdfOptionsFooter, getPdfOptionsFooter } from "./getPdfOptionsFooter"

export type GetPdfOptionsHeaderFooterProps = {
  pdfMargin: PDFOptions['margin']
  isDisplayHeaderAndFooter?: boolean
  } & {
  headerItems?: PdfHeaderProps['headerItems']
  headerMargin: PdfHeaderProps['headerMargin']
  hederFontSize?: PdfHeaderProps['hederFontSize']
  } & {
  footerItems?: PdfFooterProps['footerItems']
  footerMargin: PdfFooterProps['footerMargin']
  footerFontSize?: PdfFooterProps['footerFontSize']
  }
  
  export type PdfOptionsHeaderFooter = {
    PDFOptionsHeaderTemplate: string
    PDFOptionsFooterTemplate: string
    PDFOptionsMarginWithHeaderFooter: PDFOptions['margin']
  }
  
  /**
   * ヘッダーとフッターのテンプレートを生成し、必要なマージンも算出する
   */
  export const generateHeaderFooterTemplatesAndMargins = ({
    headerItems = ['title'],
    footerItems = ['pageNumber'],
    hederFontSize = 14,
    footerFontSize = 14,
    pdfMargin,
    headerMargin,
    footerMargin,
    isDisplayHeaderAndFooter = true
  }: GetPdfOptionsHeaderFooterProps): PdfOptionsHeaderFooter => {
    const {
      PDFOptionsHeaderTemplate,
      pdfOptionsMarginTop
    } = getPdfOptionsHeader({
      headerItems,
      hederFontSize,
      pdfMargin,
      headerMargin,
      isDisplayHeaderAndFooter
    })
  
    const {
      PDFOptionsFooterTemplate,
      pdfOptionsMarginBottom
    } = getPdfOptionsFooter({
      footerItems,
      footerFontSize,
      pdfMargin,
      footerMargin,
      isDisplayHeaderAndFooter
    })

    return {
      PDFOptionsHeaderTemplate,
      PDFOptionsFooterTemplate,
      PDFOptionsMarginWithHeaderFooter: {
        top: pdfOptionsMarginTop,
        bottom: pdfOptionsMarginBottom,
        left: pdfMargin?.left ?? '',
        right: pdfMargin?.right ?? ''
      }
    }
  }