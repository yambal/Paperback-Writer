import { marked } from 'marked'
import { customRendererForWord } from './customRenderer/customRendererForWord'
import { imageForWord } from './extentions/imageExtentionsForWord'

export type MarkdownToHtmlProps = {
  /** マークダウンテキスト */
  markdownString: string

  /** 改行を<br />に変換するか */
  isAddBrOnSingleNewLine?: boolean
}

/**
 * Markdown から HTML に変換する
 */
export const markdownToHtmlBodyForWord = ({
  markdownString,
  isAddBrOnSingleNewLine = false
}: MarkdownToHtmlProps): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {

      marked.use({
        renderer: customRendererForWord(),
        extensions: [imageForWord],
        breaks: isAddBrOnSingleNewLine
      })

    const htmlBodyString = await marked.parse(markdownString)

      resolve(htmlBodyString)

    } catch (error) {
      reject(error)
    }
  })
}