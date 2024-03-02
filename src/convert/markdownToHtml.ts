import { marked } from 'marked'
import ejs from 'ejs'
import { renderer } from './renderer'
import { defautTemplate } from '../templates/defaultTemplate'
import { hilightJsStyle } from '../templates/hilightJsStyle'

import { minify } from 'minify'

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

      const css = hilightJsStyle({})

      let html = ejs.render(defautTemplate, {
        title: 'Markdown to HTML',
        body: htmlBodyString,
        style: minify.css(css)
      })

      console.log(`html: ${html.slice(1500, 3000)}...`)
      resolve(html)

    } catch (error) {
      reject(error)
    }
  })
}