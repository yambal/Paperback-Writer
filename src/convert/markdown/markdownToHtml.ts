import { marked } from 'marked'
import ejs from 'ejs'
import { markedPWRenderer } from './markedPWRenderer'
import { defautTemplate } from '../templates/defaultTemplate'
import { ruby } from './extentions/rubyExtention'
import { plantuml, plantumlFetcher } from './extentions/plantumlExtention'

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

      marked.use({
        renderer: markedPWRenderer(),
        extensions: [ruby, plantuml],
        async: true,
        async walkTokens(token) {
          if (token.type === 'plantuml') {
            console.log('token.content', token.content)
            const res = await plantumlFetcher()
            token.html = `<div>${res}</div>`
          }
        }
      })

      const htmlBodyString = await marked.parse(markdownString)

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