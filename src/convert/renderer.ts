import { marked,  } from 'marked'
import hljs, { HighlightResult } from "highlight.js"

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

    hljs.addPlugin({
      'after:highlightElement': ({ el, result}) => {
          el.innerHTML = result.value.replace(/^/gm,'<span class="row-number"></span>')
      }
    })

    let result: HighlightResult | undefined = undefined
    if (language && language.length > 0) {
      result = hljs.highlight(code, {language})
    } else {
      result = hljs.highlightAuto(code)
    }

    const numValue = result.value.split(`\n`).map((line, index) => {
      return `<span class="row-number">${index + 1}</span>${line}`
    }).join(`\n`)

    return `<div>
    ${result.language && `<div class="language">${result.language}</div>`}
    ${fileName && `<div class="fileName">${fileName}</div>`}
    <pre><code class="hljs">${numValue}</code></pre>    
</div>`
  }

  return renderer
}