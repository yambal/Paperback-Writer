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
  
  export type PdfOptionsHeaderFooter = PdfOptionsHeader & PdfOptionsFooter
  
  export const getPdfOptionsHeaderFooter = ({
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
      pdfOptionsHeaderTemplate,
      pdfOptionsMarginTop
    } = getPdfOptionsHeader({
      headerItems,
      hederFontSize,
      pdfMargin,
      headerMargin,
      isDisplayHeaderAndFooter
    })
  
    const {
      pdfOptionsFooterTemplate,
      pdfOptionsMarginBottom
    } = getPdfOptionsFooter({
      footerItems,
      footerFontSize,
      pdfMargin,
      footerMargin,
      isDisplayHeaderAndFooter
    })
    return {
      pdfOptionsHeaderTemplate,
      pdfOptionsMarginTop,
      pdfOptionsFooterTemplate,
      pdfOptionsMarginBottom
    }
  }