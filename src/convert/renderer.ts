import { marked,  } from 'marked'
import hljs from "highlight.js"

/**
 * @see https://marked.js.org/using_pro#use
 */

export const renderer = () => {
  const renderer = new marked.Renderer()

  renderer.heading = (text, level) => {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-')
    return `
      <h${level}>
        <a name="${escapedText}" class="anchor" href="#${escapedText}">
          <span class="header-link"></span>
        </a>
        ${text}
      </h${level}>`
  }

  renderer.codespan = (text) => {
    return `<code class="inline-code">${text}</code>`
  }

  renderer.code = (code, infostring, escaped) => {
    const info = infostring ?? ''
    const [language, fileName] = info.split(':')

    const hilighted = hljs.highlightAuto(code).value

    return `<div>
    ${language && `<div class="language">${language}</div>`}
    ${fileName && `<div class="fileName">${fileName}</div>`}
    <pre><code class="hljs">${hilighted}</code></pre>    
</div>`
  }

  return renderer
}