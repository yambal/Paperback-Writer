import { marked } from 'marked'

export type MarkdownToHtmlProps = {
  markdownString: string
}
export const markdownToHtml = async ({markdownString}: MarkdownToHtmlProps): Promise<string> => {
  try {
    console.log(`markdownToHtml({text: ${markdownString.slice(0, 12)}...})`)
    return await marked(markdownString)
  } catch (error: any) {
    console.error('markdownToHtml()', error)
    return ''
  } finally {

  }
}