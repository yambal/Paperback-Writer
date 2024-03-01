export type HilightJsStyleProps = {
  backgroundColor?: string
  baseColor?: string
  commentColor?: string
  builtInColor?: string
  attrColor?: string
  stringColor?: string
}

export const hilightJsStyle = (
  {
    backgroundColor = `#f3f3f3`,
    baseColor = `#444444`,
    commentColor = `#697070`,
    builtInColor = `#397300`,
    attrColor = `#444444`,
    stringColor = `#880000`
  }: HilightJsStyleProps
): string => {

  return `
  :root{
    --bg-color: ${backgroundColor};
    --base-color: ${baseColor};
    --comment-color: ${commentColor};
    --built-in-color: ${builtInColor};
    --attr-color: ${attrColor};
    --string-color: ${stringColor};
  }
  pre code.hljs{
    display:block;
    overflow-x:auto;
    padding:1em
  }
  code.hljs{
    padding:3px 5px
  }
  .hljs{
    background: var(--bg-color);
    color: var(--base-color);
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
  `
}