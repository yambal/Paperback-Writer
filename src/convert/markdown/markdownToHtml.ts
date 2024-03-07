import { marked } from 'marked'
import ejs from 'ejs'
import { markedPWRenderer } from './renderer/markedPwRenderer'
import { defautTemplate } from '../templates/defaultTemplate'
import { ruby } from './extentions/rubyExtention'

export type MarkdownToHtmlProps = {
  /** マークダウンテキスト */
  markdownString: string

  styleTags?: string

  isAddBrOnSingleNewLine?: boolean
}

/**
 * Markdown から HTML に変換する
 */
export const markdownToHtml = ({
  markdownString,
  styleTags,
  isAddBrOnSingleNewLine = false
}: MarkdownToHtmlProps): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(`markdownToHtml({text: ${markdownString.slice(0, 12)}...})`)
      marked.use({
        renderer: markedPWRenderer(),
        extensions: [ruby],
        breaks: isAddBrOnSingleNewLine
      })
      const htmlBodyString = await marked(markdownString)

      let html = ejs.render(defautTemplate, {
        title: 'Markdown to HTML',
        body: htmlBodyString,
        style: styleTags
      })

      resolve(html)

    } catch (error) {
      reject(error)
    }
  })
}