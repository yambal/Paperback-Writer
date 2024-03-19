import { VscodeEnvLanguage } from "../../../../util"
import { BaseFont, SyntaxHighlightingFont } from "../../../../util/vscode/vscodeSettingUtil"
import { FontSetId, buildFontQuerys, getFontFamily } from "../../css/fontStyle"


/**
 * フォントに関する定義から、スタイルタグを生成する
 */

export type FontStyleTagsBuilderProps = {
  baseFont: BaseFont
  syntaxHighlightingFont: SyntaxHighlightingFont
}

export const fontStyleTagsBuilder = ({
  baseFont,
  syntaxHighlightingFont
}: FontStyleTagsBuilderProps) => {

  const fontQuerys = buildFontQuerys({
    baseFont,
    syntaxHighlightingFont
  })

  const fontCsss: string[] = []
  const googleFontNames: string[] = []
  fontQuerys.forEach((fontQuery) => {
    const { language, target, fontSet } = fontQuery
    const { fontFamily, googleFontName } = getFontFamily({ fontSet, language })
    fontCsss.push(`${target} { font-family: ${fontFamily}; }`)
    googleFontName && googleFontNames.push(googleFontName)
  })

  const uniqGoogleFontNames = Array.from(new Set(googleFontNames))
  let googleFontFamilyLink = ""
  if (googleFontNames.length > 0) {
    const preconnectLink = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
    const familyPrams = uniqGoogleFontNames.map((googleFontName, index) => {return `family=${googleFontName}`}).join("&")
    googleFontFamilyLink = `${preconnectLink}<link href="https://fonts.googleapis.com/css2?${familyPrams}&display=swap" rel="stylesheet">`
  }

  return googleFontFamilyLink + "\n<style>" + fontCsss.join("\n") + "</style>"
}
