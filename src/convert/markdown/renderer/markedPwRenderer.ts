import { marked,  } from 'marked'
import hljs, { HighlightResult } from "highlight.js"
import { hasExtension } from '../../../util'




/**
 * @see https://marked.js.org/using_pro#use
 */

export const markedPWRenderer = () => {
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

  /** インラインコード */
  renderer.codespan = (text) => {
    return `<code class="code-inline">${text}</code>`
  }

  /** コードブロック */
  renderer.code = (code, infostring, escaped) => {
    const info = infostring ?? ''
    const langAndFName = info.split(':')

    let fileName = undefined
    let languageName = undefined
    if (hasExtension(langAndFName[0])) {
      fileName = langAndFName[0]

    } else if (langAndFName[0] && langAndFName[0].length > 0) {
      languageName = langAndFName[0]
    }
    if (hasExtension(langAndFName[1])) {
      fileName = langAndFName[1]
    }

    let result: HighlightResult | undefined = undefined
    try {
      hljs.configure({
        classPrefix: 'code-block-'
      })
      if (languageName) {
        result = hljs.highlight(code, {language: languageName})
      } else {
        result = hljs.highlightAuto(code)
      }
    } catch (error) {
      result = hljs.highlightAuto(code)
    }

    const numberedValue = result.value.split(`\n`).map((line, index) => {
      return `<div class="code-block-row">
      <span class="code-block-row-number">
        ${index + 1}
      </span>
      <span><pre class="code-block-row-code">${line}</pre></span>
    </div>`
    }).join(`\n`)

    return `<div class="code-block">
  <div class="code-block-filename">${fileName}</div>
  <div class="code-block-language">${result.language}</div>
  ${numberedValue}
</div>`
  }

  return renderer
}