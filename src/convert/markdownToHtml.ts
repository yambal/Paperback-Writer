
import { marked } from 'marked'
import ejs from 'ejs'
import { renderer } from './renderer'
import { defautTemplate } from '../templates/defaultTemplate'
import { hilightJsStyle } from '../templates/hilightJsStyle'

export type MarkdownToHtmlProps = {
  /** マークダウンテキスト */
  markdownString: string
}

/**
 * Markdown から HTML に変換する
 */
export const markdownToHtml = ({markdownString}: MarkdownToHtmlProps): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(`markdownToHtml({text: ${markdownString.slice(0, 12)}...})`)
      marked.use({renderer: renderer()})
      const htmlBodyString = await marked(markdownString)

      let html = ejs.render(defautTemplate, {
        body: htmlBodyString,
        style: hilightJsStyle({
        })
      })
      resolve(html)

    } catch (error) {
      reject(error)
    }
  })
}