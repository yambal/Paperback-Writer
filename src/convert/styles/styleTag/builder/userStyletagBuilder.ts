import path from "path"
import * as vscode from 'vscode'
import {
  getHomeDirPath,
  getPaperbackWriterConfiguration,
  getUri,
  getVscodeUri,
  getWorkspaceFolder,
  showMessage
} from "../../../../util"

export type UserStyleTagsBuilderProps = {
  editorDocVsUrl: vscode.Uri,
  userCustomCss: string[]
}

export const userStyleTagsBuilder = ({
  editorDocVsUrl,
  userCustomCss
}: UserStyleTagsBuilderProps) => {
  const styleLinks: string[] = []

  if (userCustomCss && Array.isArray(userCustomCss) && userCustomCss.length > 0) {
    userCustomCss.forEach((styleFilePath, index) => {
      const href = fixHref(editorDocVsUrl, styleFilePath)
      console.log(`markdown.style (${index}): ${href}`)
      styleLinks.push(`<link rel="stylesheet" href="${href}" type="text/css">`)
    })
  }

  return styleLinks.join('\n')
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