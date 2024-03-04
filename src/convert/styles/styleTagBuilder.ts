import path from "path"
import * as vscode from 'vscode'
import { getHomeDirPath, getPaperbackWriterConfiguration, getUri, getVscodeUri, getWorkspaceFolder, showMessage } from "../../vscode-util"
import { vscodeMarkdownStyle } from "./css/vscodeMarkdownStyle"
import { hilightJsStyle } from "./css/hilightJsStyle"
import { remedyCss } from "./css/remedyCss"
import { getFontStyleTags, GetFontStyleTagsProps } from "./css/fontStyle"

var CleanCSS = require('clean-css')

export type StyleTagBuilderProps = {
  editorDocVsUrl: ThemeStyleTagBuilderProps['editorDocVsUrl']
  fontQuerys: GetFontStyleTagsProps['fontQuerys']
}

export const styleTagBuilder = ({
  editorDocVsUrl,
  fontQuerys
}:StyleTagBuilderProps) => {

  const styleTags = themeStyleTagBuilder({editorDocVsUrl})
  const fontStyleTags = getFontStyleTags({fontQuerys})

  return fontStyleTags + '\n' + styleTags
}

type ThemeStyleTagBuilderProps = {
  editorDocVsUrl: vscode.Uri
}
type BuildedStyle = string
export const themeStyleTagBuilder = ({
  editorDocVsUrl
}: ThemeStyleTagBuilderProps) => {
  const styleTags: string[] = []
  const styleLinks: string[] = []

  try {

    const PwCnf = getPaperbackWriterConfiguration()
    
    const includeDefaultStyles = PwCnf.includeDefaultStyles
    
    // 1. vscodeのスタイルを読む。
    if (includeDefaultStyles) {
      const styles: string[] = []
      styles.push(remedyCss)
      styles.push(vscodeMarkdownStyle)
      styles.push(hilightJsStyle({}))

      const minified = new CleanCSS({}).minify(styles.join('\n')).styles

      const defaultStyleTag = `<style>${minified}</style>`
      styleTags.push(defaultStyleTag)
    }

    // 2. markdown.styles設定のスタイルを読む
    const styles = PwCnf.styles
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
    if (workspaceFolder && !PwCnf.stylesRelativePathFile) {
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
