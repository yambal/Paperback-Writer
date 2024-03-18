import { customRendererCodeBlockCSSGenerator } from "./customRendererCodeBlockCSSGenerator"

// Code Theming
export type CodeThemeName = "White & Black: Dark" | "White & Black: Light"

export type CustomRendererCodeBlockThemeCSSGeneratorProps = {
  /** テーマ名 */
  theme?: {
    themeName: CodeThemeName | ""
    showLineNumbers: boolean
  }
}

/**
 * テーマ名からCSSを生成する
 */
export const customRendererCodeBlockThemeCSSGenerator = ( {
  theme
}: CustomRendererCodeBlockThemeCSSGeneratorProps): string => {

  console.log(theme)

  const {
    themeName,
    showLineNumbers = true
  } = theme ?? {}

  switch (themeName) {
    case "White & Black: Light":
      return customRendererCodeBlockCSSGenerator({
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
      return customRendererCodeBlockCSSGenerator({
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
      return customRendererCodeBlockCSSGenerator({})
  }
}