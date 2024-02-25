import { marked } from 'marked'

export const markdownToHtml = async (mdfilename:string, output_type:string, text:string): Promise<string> => {
  try {
    console.group(`markdownToHtml({text: ${text.slice(0, 12)}...})`)
    return await marked(text)
  } catch (error: any) {
    console.error('markdownToHtml()', error)
    return ''
  } finally {
    console.groupEnd()
  }
}