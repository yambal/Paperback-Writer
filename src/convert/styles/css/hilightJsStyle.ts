import { darken, readableColor } from 'polished'

export type HilightJsStyleProps = {
  backgroundColor?: string
  baseColor?: string
  commentColor?: string
  builtInColor?: string
  attrColor?: string
  stringColor?: string
  borderColor?: string
  round?: string
}

export const hilightJsStyle = (
  {
    backgroundColor = `#f3f3f3`,
    baseColor = `#444444`,
    commentColor = `#697070`,
    builtInColor = `#397300`,
    attrColor = `#444444`,
    stringColor = `#880000`,
    borderColor,
    round = `0.5em`
  }: HilightJsStyleProps
): string => {

  borderColor = borderColor || darken(0.1, backgroundColor)
  const readableColorOnBorder = readableColor(borderColor, 'white', baseColor)
  

  return `
  :root{
    --bg-color: ${backgroundColor};
    --base-color: ${baseColor};
    --comment-color: ${commentColor};
    --built-in-color: ${builtInColor};
    --attr-color: ${attrColor};
    --string-color: ${stringColor};
    --border-color: ${borderColor};
    --color-on-border: ${readableColorOnBorder};
  }

  .hljs{
    position: relative;
    background: var(--bg-color);
    color: var(--base-color);
    padding-top: 2em;
    border-radius: ${round};
    border: 1px solid var(--border-color);
  }

  .hljs .hljs-language {
    position: absolute;
    top: 0;
    right: 0;
    background-color: var(--border-color);
    color: var(--color-on-border);
    padding: 0.25em 1em;
    border-top-right-radius: 0.5em;
    border-bottom-left-radius: 0.5em;
  }

  .hljs .hljs-filename {
    position: absolute;
    top: 0;
    left: 0;
    background-color: var(--border-color);
    color: var(--color-on-border);
    padding: 0.25em 1em;
    border-top-left-radius: 0.5em;
    border-bottom-right-radius: 0.5em;
  }

  .hljs-comment{
    color: var(--comment-color);
  }
  .hljs-punctuation,.hljs-tag{
    color:#444a
  }
  .hljs-tag .hljs-attr {
    color: var(--attr-color);
  }
  .hljs-tag .hljs-name{
    color:#444
  }
  .hljs-attribute,.hljs-doctag,.hljs-keyword,.hljs-meta .hljs-keyword,.hljs-name,.hljs-selector-tag{
    font-weight:700
  }
  .hljs-string{
    color: var(--string-color);
  }
  .hljs-deletion,.hljs-number,.hljs-quote,.hljs-selector-class,.hljs-selector-id,.hljs-template-tag,.hljs-type{
    color:#800
  }
  .hljs-section,.hljs-title{
    color:#800;
    font-weight:700
  }
  .hljs-link,.hljs-operator,.hljs-regexp,.hljs-selector-attr,.hljs-selector-pseudo,.hljs-symbol,.hljs-template-variable,.hljs-variable{
    color:#ab5656
  }
  .hljs-literal{
    color:#695
  }
  .hljs-built_in {
    color: var(--built-in-color);
  }
  .hljs-addition,.hljs-bullet,.hljs-code{
    color:#397300
  }
  .hljs-meta{
    color:#1f7199
  }
  .hljs-meta .hljs-string{
    color:#38a
  }
  .hljs-emphasis{
    font-style:italic
  }
  .hljs-strong{
    font-weight:700
  }

  .hljs-row {
    display: grid;
    grid-template-columns: 5em auto;
  }
  .hljs pre {
    margin: 0;
  }
  .hljs-row:not(:last-child) {
    border-bottom: 1px solid var(--border-color);
  }

  .hljs-row-number {
    padding: 0 0.5em;
    border-right: 1px solid var(--border-color);
    text-align: right;
    user-select: none;
  }

  .hljs-row-code {
    padding: 0 0.5em;
  }
  `
}