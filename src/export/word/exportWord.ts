import HTMLtoDOCX from 'html-to-docx'
import fs from 'fs'

export type ExportWordProps = {
  exportPathName: string
  htmlString: string
  headerHTMLString: string
  footerHTMLString: string
  documentOptions?: {
    orientation?: "portrait" | "landscape"
    pageSize?: {
      width: string
      height: string
    }
    margins?: {
      top: string
      right: string
      bottom: string
      left: string
      header: string
      footer: string
      butter: string
    }
    title?: string
    subject?: string
    krywords?: string[]
    lastModifiedBy?: string
    revision?: number
    createdAt?: number
    modifiedAt?: number
    headerType?: "default" | "first" | "even"
    header?: boolean
    footerType?: "default" | "first" | "even"
    footer?: boolean
    font?: string
    fontSize?: number
    complexScriptFontSize?: number
    table?: {
      row: {
        cantSplit: boolean
      }
    }
    pageNumber?: boolean
    skipFirstHeaderFooter?: boolean
    lineNumber?: boolean
    lineNumberOptions?: {
      start: number
      countBy: number
      restart: "continuous" | "newPage" | "newSection"
    }
    numbering?: {
      defaultOrderedListStyleType: string
    }
    decodeUnicode?: boolean
    lang?: string
  }
}

export const exportWord = ({
  exportPathName,
  htmlString,
  headerHTMLString,
  footerHTMLString,
  documentOptions
}: ExportWordProps): Promise<void> => {

  return new Promise((resolve, reject) => {
    try {

      console.log('htmlString', htmlString)

      // const stripHtml = stripEmptyHtmlTags(htmlString.replace(/<img[^>]*>/g, ''))

      HTMLtoDOCX(htmlString, headerHTMLString, documentOptions, footerHTMLString)
      .then((buffer: any) => {
        fs.writeFile(exportPathName, buffer, (err) => {
          if (err) {
            reject(err)
            return
          }
          resolve()
        })
       
      })
    } catch (error) {
      console.error(error)
      reject(error)
    }

  })

}

/**
 * 空のタグ、空白を削除
 */
const stripEmptyHtmlTags = (htmlString: string): string => {
  const strippedString = htmlString.replace(/<(\w+)([^>]*)>\s*<\/\1>/g, '').replace(/\s+/g, '').replace(/\s+/g, '').trim().trim();
  if (strippedString === htmlString) {
    return strippedString;
  } else {
    return stripEmptyHtmlTags(strippedString);
  }
};