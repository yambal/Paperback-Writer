import { marked } from 'marked'
import ejs from 'ejs'
import { markedPWRenderer } from './markedPWRenderer'
import { defautTemplate } from '../templates/defaultTemplate'


export type MarkdownToHtmlProps = {
  /** マークダウンテキスト */
  markdownString: string

  styleTags?: string
}

/**
 * Markdown から HTML に変換する
 */
export const markdownToHtml = ({
  markdownString,
  styleTags
}: MarkdownToHtmlProps): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(`markdownToHtml({text: ${markdownString.slice(0, 12)}...})`)
      marked.use({renderer: markedPWRenderer()})
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