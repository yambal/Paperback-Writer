import { marked } from 'marked'
import ejs from 'ejs'
import { markedPWRenderer } from './markedPWRenderer'
import { defautTemplate } from '../templates/defaultTemplate'
import { hilightJsStyle } from '../templates/hilightJsStyle'
import { remedyCss } from '../templates/remedyCss'

var CleanCSS = require('clean-css')

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
      marked.use({renderer: markedPWRenderer()})
      const htmlBodyString = await marked(markdownString)

      const css = remedyCss + hilightJsStyle({})
      var output = new CleanCSS({}).minify(css)

      let html = ejs.render(defautTemplate, {
        title: 'Markdown to HTML',
        body: htmlBodyString,
        style: output.styles
      })

      console.log(`html: ${html.slice(1500, 3000)}...`)
      resolve(html)

    } catch (error) {
      reject(error)
    }
  })
}