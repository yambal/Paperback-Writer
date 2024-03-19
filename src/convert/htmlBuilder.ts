import { MarkdownToHtmlProps, markdownToHtmlBody } from "./markdown/markdownToHtmlBody"
import ejs from 'ejs'
import { defautTemplate } from "./templates/defaultTemplate"
import { StyleTagBuilderProps, styleTagBuilder } from "./styles/styleTagBuilder"
import { BaseFont } from "../util/vscode/vscodeSettingUtil"

type HtmlBuilderProps = 
  MarkdownToHtmlProps &
  Omit<StyleTagBuilderProps, "fontQuerys"> &
  {
    /** 文章のタイトル */
    title: string
  
    /** Headerに挿入するCSS */
    styleTags?: string

    baseFont: BaseFont
  }

export const htmlBuilder = ({
  title,
  markdownString,
  isAddBrOnSingleNewLine,
  editorDocVsUrl,
  lineHeight,
  codeTheme,
  baseFont,
  syntaxHighlightingFont
}: HtmlBuilderProps):Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      markdownToHtmlBody({
        markdownString,
        isAddBrOnSingleNewLine
      })
      .then(htmlBodyString => {

        const styleTags  = styleTagBuilder({
          editorDocVsUrl,
          lineHeight,
          codeTheme,
          baseFont,
          syntaxHighlightingFont
        })

        let html = ejs.render(defautTemplate, {
          title,
          body: htmlBodyString,
          style: styleTags
        })

        resolve(html)

      })
    } catch (error) {
      reject(error)
    }
  })
}


