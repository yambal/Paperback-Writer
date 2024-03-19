import { marked } from 'marked'
import { customRenderer } from './customRenderer/customRenderer'

import { ruby } from './extentions/rubyExtention'

export type MarkdownToHtmlProps = {
  /** マークダウンテキスト */
  markdownString: string

  /** 改行を<br />に変換するか */
  isAddBrOnSingleNewLine?: boolean
}

/**
 * Markdown から HTML に変換する
 */
export const markdownToHtmlBody = ({
  markdownString,
  isAddBrOnSingleNewLine = false
}: MarkdownToHtmlProps): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      marked.use({
        renderer: customRenderer(),
        extensions: [ruby],
        breaks: isAddBrOnSingleNewLine
      })
      const htmlBodyString = await marked(markdownString)

      resolve(htmlBodyString)

    } catch (error) {
      reject(error)
    }
  })
}