import { marked } from 'marked'
import ejs from 'ejs'
import { isExistsPath } from '../util'
import { defautTemplate } from '../templates/defaultTemplate'

export type MarkdownToHtmlProps = {
  /** マークダウンテキスト */
  markdownString: string
}

/**
 * Markdown から HTML に変換する
 */
export const markdownToHtml = async ({markdownString}: MarkdownToHtmlProps): Promise<string> => {
  try {
    console.log(`markdownToHtml({text: ${markdownString.slice(0, 12)}...})`)

    const htmlBodyString = await marked(markdownString)

    let html = ejs.render(defautTemplate, {body: htmlBodyString})

    return html
  } catch (error: any) {
    console.error('markdownToHtml()', error)
    return ''
  } finally {

  }
}