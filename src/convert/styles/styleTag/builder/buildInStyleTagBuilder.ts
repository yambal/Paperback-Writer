import { remedyCss } from "../../css/remedyCss"
import { blockquoteCss } from "../../css/blockquoteCss"
import { headerCss } from "../../css/headerCss"
import { CustomRendererCodeBlockThemeCSSGeneratorProps, customRendererCodeBlockThemeCSSGenerator } from "../../../markdown/customRenderer/customRendererCodeBlockThemeCSSGenerator"

var CleanCSS = require('clean-css')

// ------------------------------
export type BuildInStyleTagBuilderProps = {
  baseFontSize?: number
  lineHeight?: number
  codeTheme?: CustomRendererCodeBlockThemeCSSGeneratorProps['theme']
  h1HeaderScale: number
}

/**
 * テーマに関する組み込みスタイルタグを生成する
 */
export const buildInStyleTagBuilder = ({
  baseFontSize = 14,
  lineHeight = 1.5,
  codeTheme,
  h1HeaderScale = 2
}: BuildInStyleTagBuilderProps): string => {
  const styleTags: string[] = []
  const styleLinks: string[] = []

  const builtInStyles: string[] = []

  builtInStyles.push(remedyCss)
  builtInStyles.push(`html { font-size: ${baseFontSize}px; }`)
  builtInStyles.push(`body { line-height: ${lineHeight}em; }`)
  builtInStyles.push(headerCss({h1Scale: h1HeaderScale}))
  builtInStyles.push(customRendererCodeBlockThemeCSSGenerator({theme: codeTheme}))
  builtInStyles.push(blockquoteCss())

  const minified = new CleanCSS({}).minify(builtInStyles.join('\n')).styles
  styleTags.push(`<style>${minified}</style>`)

  const res = styleTags.join('\n') + '\n' + styleLinks.join('\n')

  return res
}