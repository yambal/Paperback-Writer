import path from "path"
import * as vscode from 'vscode'
import { VscodeEnvLanguage, getHomeDirPath, getPaperbackWriterConfiguration, getUri, getVscodeUri, getWorkspaceFolder, showMessage } from "../../vscode-util"
import { remedyCss } from "./css/remedyCss"
import { FontSetId, getFontFamily } from "./css/fontStyle"
import { blockquoteCss } from "./css/blockquoteCss"
import { headerCss } from "./css/headerCss"
import { CustomRendererCodeBlockThemeCSSGeneratorProps, customRendererCodeBlockThemeCSSGenerator } from "../markdown/customRenderer/customRendererCodeBlockThemeCSSGenerator"

var CleanCSS = require('clean-css')

export type StyleTagBuilderProps = {
  editorDocVsUrl: ThemeStyleTagBuilderProps['editorDocVsUrl']
  lineHeight?: number
  fontQuerys: GetFontStyleTagsProps['fontQuerys']
  codeTheme?: CustomRendererCodeBlockThemeCSSGeneratorProps['theme']
}

export const styleTagBuilder = ({
  editorDocVsUrl,
  lineHeight = 1.5,
  fontQuerys,
  codeTheme
}:StyleTagBuilderProps) => {

  const styleTags = themeStyleTagsBuilder({
    editorDocVsUrl,
    lineHeight,
    codeTheme
  })
  const fontStyleTags = fontStyleTagsBuilder({fontQuerys})

  return fontStyleTags + '\n' + styleTags
}


// ------------------------------
export type ThemeStyleTagBuilderProps = {
  editorDocVsUrl: vscode.Uri,
  lineHeight?: number
  codeTheme?: CustomRendererCodeBlockThemeCSSGeneratorProps['theme']
}
type BuildedStyle = string

/**
 * テーマに関するスタイルタグを生成する
 */
export const themeStyleTagsBuilder = ({
  editorDocVsUrl,
  lineHeight = 1.5,
  codeTheme
}: ThemeStyleTagBuilderProps): string => {
  const styleTags: string[] = []
  const styleLinks: string[] = []

  const PwCnf = getPaperbackWriterConfiguration()

  try {
    // 1. vscodeのスタイルを読む。
    const includeDefaultStyles = PwCnf.style.includeDefaultStyle
    const builtInStyles: string[] = []
    if (includeDefaultStyles) {
      builtInStyles.push(remedyCss)
      builtInStyles.push(`body { line-height: ${lineHeight}rem; }`)
      builtInStyles.push(customRendererCodeBlockThemeCSSGenerator({theme: codeTheme}))
      builtInStyles.push(blockquoteCss())
    }

    // 2. header
    builtInStyles.push(`html { font-size: ${PwCnf.style.font.baseSize}px; }`)

    // 3. ベースフォントサイズ
    builtInStyles.push(headerCss({
      h1Scale: PwCnf.style.typography.h1HeaderScale
    }))
      
    const minified = new CleanCSS({}).minify(builtInStyles.join('\n')).styles
    styleTags.push(`<style>${minified}</style>`)

    // 3. markdown.styles(ユーザー)設定のスタイルを読む
    const styles = PwCnf.style.customCSS
    if (styles && Array.isArray(styles) && styles.length > 0) {
      styles.forEach((styleFilePath, index) => {
        const href = fixHref(editorDocVsUrl, styleFilePath)
        console.log(`markdown.style (${index}): ${href}`)
        styleLinks.push(`<link rel="stylesheet" href="${href}" type="text/css">`)
      })
    }

    const res = styleTags.join('\n') + '\n' + styleLinks.join('\n')

    return res

  } catch (error) {
    showMessage({message: "readStyles()", type: 'error'})
    const res: BuildedStyle = styleTags.join('\n') + '\n' + styleLinks.join('\n')

    return res
  }
}

/**
 * 編集中ドキュメントから、指定ファイルへの相対パスを取得する
 * @todo リファクタリング
 */
const fixHref = (editorDocVsUri: vscode.Uri, workspaceFilePath: string) => {
  try {
    const PwCnf = getPaperbackWriterConfiguration()
    if (!path) {
      return path
    }

    // すでにURLになっている場合はhrefを使う
    const hrefUri = getVscodeUri(workspaceFilePath)
    if (['http', 'https'].indexOf(hrefUri.scheme) >= 0) {
      console.log('network')
      return hrefUri.toString()
    }

    // ^ で始まる場合、ホームディレクトリの相対パスを使用する
    if (workspaceFilePath.indexOf('~') === 0) {
      console.log('~')
      return getHomeDirPath(workspaceFilePath)
    }

    // ワークスペースがあり、markdown-pdf.stylesRelativePathFileがfalseの場合、ワークスペース相対パスを使用する。
    const workspaceFolder = getWorkspaceFolder(editorDocVsUri)
    if (workspaceFolder && !PwCnf.style.customCSSRelativePathFile) {
      // 編集ファイルのディレクトリのパス
      const editorDocUri = path.dirname(editorDocVsUri.fsPath)

      // CSSファイルのパス
      let fileAbsoluteUri = getUri(workspaceFilePath)
      if(!path.isAbsolute(workspaceFilePath)) {
        fileAbsoluteUri = getUri(path.join(workspaceFolder.uri.path, workspaceFilePath))
      }
      
      // 編集ファイルからの相対パス(参照元ディレクトリから、対象を指定する）
      const rPath = path.relative(editorDocUri, fileAbsoluteUri.fsPath)
      console.log(`${workspaceFilePath} = ${fileAbsoluteUri.fsPath} <- ${editorDocVsUri.fsPath} = ${rPath}`)
      return rPath
    }

    // マークダウン・ファイルからの相対参照
    return workspaceFilePath

  } catch (error) {
    showMessage({message: "fixHref()", type: 'error'})
  }
}


/**
 * フォントに関する定義から、スタイルタグを生成する
 */
export type FontQuery = {
  language?: VscodeEnvLanguage
  target: string
  fontSet: FontSetId
}

type GetFontStyleTagsProps = {
  fontQuerys: FontQuery[]
}

const fontStyleTagsBuilder = ({
  fontQuerys
}: GetFontStyleTagsProps) => {
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
