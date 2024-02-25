import { marked } from 'marked'

export const markdownToHtml = async (text:string): Promise<string> => {
  try {
    console.log(`markdownToHtml({text: ${text.slice(0, 12)}...})`)
    return await marked(text)
  } catch (error: any) {
    console.error('markdownToHtml()', error)
    return ''
  } finally {

  }
}