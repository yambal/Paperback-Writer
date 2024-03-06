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

export const codeCss = (
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

  .code-block {
    position: relative;
    background: var(--bg-color);
    color: var(--base-color);
    padding-top: 2em;
    border-radius: ${round};
    border: 1px solid var(--border-color);
  }

  .code-block .code-block-language {
    position: absolute;
    top: 0;
    right: 0;
    background-color: var(--border-color);
    color: var(--color-on-border);
    padding: 0.25em 1em;
    border-top-right-radius: 0.5em;
    border-bottom-left-radius: 0.5em;
  }

  .code-block .code-block-filename {
    position: absolute;
    top: 0;
    left: 0;
    background-color: var(--border-color);
    color: var(--color-on-border);
    padding: 0.25em 1em;
    border-top-left-radius: 0.5em;
    border-bottom-right-radius: 0.5em;
  }

  .code-block-comment{
    color: var(--comment-color);
  }
  .code-block-punctuation,.code-block-tag{
    color:#444a
  }
  .code-block-tag .code-block-attr {
    color: var(--attr-color);
  }
  .code-block-tag .code-block-name{
    color:#444
  }
  .code-block-attribute,.code-block-doctag,.code-block-keyword,.code-block-meta .code-block-keyword,.code-block-name,.code-block-selector-tag{
    font-weight:700
  }
  .code-block-string{
    color: var(--string-color);
  }
  .code-block-deletion,.code-block-number,.code-block-quote,.code-block-selector-class,.code-block-selector-id,.code-block-template-tag,.code-block-type{
    color:#800
  }
  .code-block-section,.code-block-title{
    color:#800;
    font-weight:700
  }
  .code-block-link,.code-block-operator,.code-block-regexp,.code-block-selector-attr,.code-block-selector-pseudo,.code-block-symbol,.code-block-template-variable,.code-block-variable{
    color:#ab5656
  }
  .code-block-literal{
    color:#695
  }
  .code-block-built_in {
    color: var(--built-in-color);
  }
  .code-block-addition,.code-block-bullet,.code-block-code{
    color:#397300
  }
  .code-block-meta{
    color:#1f7199
  }
  .code-block-meta .code-block-string{
    color:#38a
  }
  .code-block-emphasis{
    font-style:italic
  }
  .code-block-strong{
    font-weight:700
  }

  .code-block-row {
    display: grid;
    grid-template-columns: 5em auto;
  }
  .code-block pre {
    margin: 0;
  }
  .code-block-row:not(:last-child) {
    border-bottom: 1px dashed var(--border-color);
  }

  .code-block-row-number {
    padding: 0 0.5em;
    border-right: 1px solid var(--border-color);
    text-align: right;
    user-select: none;
  }

  .code-block-row-code {
    padding: 0 0.5em;
  }

  /** インラインコード */
  .code-inline {
    background-color: var(--bg-color);
    color: var(--base-color);
    padding: 0.1em 0.3em;
    border-radius: 0.3em;
    border: 1px solid var(--border-color);
  }
  `
}