import { darken, readableColor } from 'polished'

export type HilightJsStyleProps = {
  baseColor?: string
  showLineNumbers?: boolean
  box?: {
    round?: string
    borderWidth?: number
    borderColor?: string
    backgroundColor?: string
    lineHeight?: string
  }
  block?: {
    commentColor?: string
    punctuationColor?: string
    attrColor?: string
    stringColor?: string
    sectionTitleColor?: string
    tagColor?: string
    nameColor?: string
    builtInColor?: string
    structureColor?: string
    basicElementsColor?: string
    codeElementsColor?: string
    metaColor?: string
    literalColor?: string
  }
}

export const codeCss = (
  {
    baseColor = `#444444`,
    showLineNumbers = true,
    box ={},
    block = {}
  }: HilightJsStyleProps
): string => {

  const {
    round = `0.5em`,
    borderWidth = 1,
    borderColor: _borderColor,
    backgroundColor = `#f3f3f3`,
    lineHeight = `1.5em`
  } = box

  const borderColor = _borderColor || darken(0.1, backgroundColor)
  const readableColorOnBorder = readableColor(borderColor, 'white', baseColor)

  const {
    commentColor = `#697070`,
    punctuationColor = `#444a`,
    attrColor = `#444444`,
    tagColor = `#444444`,
    nameColor = `#444444`,
    stringColor = `#880000`,
    sectionTitleColor= `#880000`,
    structureColor = `#880000`,
    builtInColor = `#397300`,
    basicElementsColor = `#ab5656`,
    codeElementsColor = `#397300`,
    metaColor = `#f7199`,
    literalColor = `#695`
  } = block
  
  return `
  :root{
    --bg-color: ${backgroundColor};
    --base-color: ${baseColor};
    --border-color: ${borderColor};
    --color-on-border: ${readableColorOnBorder};
    --block-comment-color: ${commentColor};
    --block-punctuation-color: ${punctuationColor};
    --block-attr-color: ${attrColor};
    --block-string-color: ${stringColor};
    --block-section_title-color: ${sectionTitleColor};
    --block-basicElements-color: ${basicElementsColor};
    --block-tag-color: ${tagColor};
    --block-name-color: ${nameColor};
    --block-builtin-color: ${builtInColor};
    --block-structure-color: ${structureColor};
    --block-codeElements-color: ${codeElementsColor};
    --block-meta-color: ${metaColor};
    --block-literal-color: ${literalColor};
  }

  .code-block {
    position: relative;
    background: var(--bg-color);
    color: var(--base-color);
    padding-top: 1.75em;
    border-radius: ${round};
    border: ${borderWidth}px solid var(--border-color);
    line-height: ${lineHeight};
  }

  .code-block .code-block-language {
    position: absolute;
    top: 0px;
    right: 0px;
    background-color: var(--border-color);
    color: var(--color-on-border);
    padding: 0.125em 1em;
    border-top-right-radius: calc( ${round} - ${borderWidth}px );
    border-bottom-left-radius: ${round};
    line-height: 1.2em;
  }

  .code-block .code-block-filename {
    position: absolute;
    top: 0px;
    left: 0px;
    background-color: var(--border-color);
    color: var(--color-on-border);
    padding: 0.125em 1em;
    border-top-left-radius: calc( ${round} - ${borderWidth}px );
    border-bottom-right-radius: ${round};
    line-height: 1.2em;
  }

  .code-block-comment{
    color: var(--block-comment-color);
  }

  .code-block-punctuation {
    color: var(--block-punctuation-color)
  }

  .code-block-attr {
    color: var(--block-attr-color);
  }

  .code-block-tag{
    color: var(--block-tag-color);
  }
  
  .code-block-name{
    color: var(--block-name-color);
  }

  .code-block-attribute,
  .code-block-doctag,
  .code-block-meta .code-block-keyword,
  .code-block-name,
  .code-block-selector-tag {
    font-weight:700
  }

  .code-block-string{
    color: var(--block-string-color);
  }

  .code-block-deletion,
  .code-block-number,
  .code-block-quote,
  .code-block-selector-class,
  .code-block-selector-id,
  .code-block-template-tag,
  .code-block-type {
    color: var(--block-structure-color);
  }

  .code-block-section,
  .code-block-title{
    color: var(--block-section_title-color);
    font-weight:700
  }

  .code-block-link,
  .code-block-operator,
  .code-block-regexp,
  .code-block-selector-attr,
  .code-block-selector-pseudo,
  .code-block-symbol,
  .code-block-template-variable,
  .code-block-variable {
    color: var(--block-basicElements-color);
  }

  .code-block-literal{
    color: var(--block-literal-color);
  }

  .code-block-built_in {
    color: var(--block-builtin-color);
  }

  .code-block-addition,
  .code-block-bullet,
  .code-block-code{
    color: var(--block-codeElements-color);
  }
  .code-block-meta{
    color: var(--block-meta-color);
  }

  .code-block-emphasis{
    font-style:italic
  }
  .code-block-strong{
    font-weight:700
  }

  .code-block-row {
    ${showLineNumbers ?`display: grid;
    grid-template-columns: 5em auto;` : ''}
  }

  .code-block pre {
    margin: 0;
  }
  .code-block-row:not(:last-child) {
    border-bottom: 1px dashed var(--border-color);
  }

  .code-block-row-number {
    ${!showLineNumbers ? `display: none;` : ''}
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

// Code Theming
export type CodeThemeName = "White & Black: Dark" | "White & Black: Light"

export type CodeThemeToCssProps = {
  /** テーマ名 */
  theme?: {
    themeName: CodeThemeName | ""
    showLineNumbers: boolean
  }
}

/**
 * テーマ名からCSSを生成する
 */
export const codeThemeToCss = ( {
  theme
}: CodeThemeToCssProps): string => {

  console.log(theme)

  const {
    themeName,
    showLineNumbers = true
  } = theme ?? {}

  switch (themeName) {
    case "White & Black: Light":
      return codeCss({
        baseColor: `#000000`,
        showLineNumbers,
        box: {
          backgroundColor: `#FFFFFF`,
          borderColor: `#000000`,
          borderWidth: 1
        },
        block: {
          commentColor: `#000000`,
          punctuationColor: `#000000`,
          stringColor: `#000000`,
          sectionTitleColor: `#000000`,
          tagColor: `#000000`,
          nameColor: `#000000`,
          builtInColor: `#000000`,
          basicElementsColor: `#000000`,
          structureColor: `#000000`,
          codeElementsColor: `#000000`,
          metaColor: `#000000`,
          literalColor: `#000000`,
          attrColor: `#000000`,
        }
      })

    case "White & Black: Dark":
      return codeCss({
        baseColor: `#FFFFFF`,
        showLineNumbers,
        box: {
          backgroundColor: `#000000`,
          borderColor: `#FFFFFF`,
          borderWidth: 1
        },
        block: {
          commentColor: `#FFFFFF`,
          punctuationColor: `#FFFFFF`,
          stringColor: `#FFFFFF`,
          sectionTitleColor: `#FFFFFF`,
          tagColor: `#FFFFFF`,
          nameColor: `#FFFFFF`,
          builtInColor: `#FFFFFF`,
          basicElementsColor: `#FFFFFF`,
          structureColor: `#FFFFFF`,
          codeElementsColor: `#FFFFFF`,
          metaColor: `#FFFFFF`,
          literalColor: `#FFFFFF`,
          attrColor: `#FFFFFF`,
        }
      })

    default:
      return codeCss({})
  }
}