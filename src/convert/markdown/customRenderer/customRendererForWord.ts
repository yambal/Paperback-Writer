import { marked,  } from 'marked'

/**
 * Marked Custom Renderer 
 * @see https://marked.js.org/using_pro#use
 */
export const customRendererForWord = () => {
  const renderer = new marked.Renderer()

  renderer.heading = (text, level) => {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-')
    return `
      <h${level}>${text}</h${level}>`
  }

  /** インラインコード */
  renderer.codespan = (text) => {
    return `<code class="code-inline">${text}</code>`
  }

  /** コードブロック */
  renderer.code = (code, infostring, escaped) => {
    const forWord = code.replace(/\n/g, '<br />');
    return `<p>${forWord}</p>`
  }

  return renderer
}