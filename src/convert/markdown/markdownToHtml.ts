import { marked } from 'marked'
import ejs from 'ejs'
import { customRenderer } from './customRenderer/customRenderer'
import { defautTemplate } from '../templates/defaultTemplate'
import { ruby } from './extentions/rubyExtention'

export type MarkdownToHtmlProps = {
  /** 文章のタイトル */
  title: string

  /** マークダウンテキスト */
  markdownString: string

  styleTags?: string

  isAddBrOnSingleNewLine?: boolean
}

/**
 * Markdown から HTML に変換する
 */
export const markdownToHtml = ({
  title,
  markdownString,
  styleTags,
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

      let html = ejs.render(defautTemplate, {
        title,
        body: htmlBodyString,
        style: styleTags
      })

      resolve(html)

    } catch (error) {
      reject(error)
    }
  })
}