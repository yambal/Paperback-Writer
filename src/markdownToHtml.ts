import { marked } from 'marked'

export const markdownToHtml = async (mdfilename:string, output_type:string, text:string): Promise<string> => {
  return await marked(text)
}