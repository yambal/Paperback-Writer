import path, { join } from "path"
import * as vscode from 'vscode'
import { getHomeDirPath, getPaperbackWriterConfiguration, getPath, getVscodeUri, getWorkspaceFolder, showMessage } from "../../vscode-util"
import { readFile } from "../../util"
import { vscodeMarkdownStyle } from "./css/vscodeMarkdownStyle"
import { hilightJsStyle } from "./css/hilightJsStyle"
import { remedyCss } from "./css/remedyCss"

var CleanCSS = require('clean-css')

export const styleTagBuilder = (uri: vscode.Uri) => {
  
  try {
    console.group(`readStyles(${uri})`)
    const PwCnf = getPaperbackWriterConfiguration()
    
    const includeDefaultStyles = PwCnf.includeDefaultStyles
    const styleTags: string[] = []

    // 1. vscodeのスタイルを読む。
    if (includeDefaultStyles) {
      const styles: string[] = []
      styles.push(remedyCss)
      styles.push(vscodeMarkdownStyle)
      styles.push(hilightJsStyle({}))

      const minified = new CleanCSS({}).minify(styles.join('\n'))

      const defaultStyleTag = `<style>${minified}</style>`
      styleTags.push(defaultStyleTag)
    }

    // 2. markdown.styles設定のスタイルを読む
    if (includeDefaultStyles) {
      const styles = PwCnf.styles
      if (styles && Array.isArray(styles) && styles.length > 0) {
        styles.forEach((style, index) => {
          var href = fixHref(uri, style)
          console.log(`markdown.style (${index}): ${href}`)
          const userStyle = '<link rel=\"stylesheet\" href=\"' + href + '\" type=\"text/css\">'
          styleTags.push(userStyle)
        })
      }
    }

    console.groupEnd()
    return styleTags.join('\n')

  } catch (error) {
    showMessage({message: "readStyles()", type: 'error'})
  } finally {
    
  }
}

const makeCss = (filename: string) => {
  try {
    var css = readFile(filename)
    if (css) {
      return '\n<style>\n' + css + '\n</style>\n'
    } else {
      return ''
    }
  } catch (error) {
    showMessage({message: "makeCss()", type: 'error'})
  }
}

/*
 * vscode/extensions/markdown-language-features/src/features/previewContentProvider.ts fixHref()
 * https://github.com/Microsoft/vscode/blob/0c47c04e85bc604288a288422f0a7db69302a323/extensions/markdown-language-features/src/features/previewContentProvider.ts#L95
 *
 * Extension Authoring: Adopting Multi Root Workspace APIs ?E Microsoft/vscode Wiki
 * https://github.com/Microsoft/vscode/wiki/Extension-Authoring:-Adopting-Multi-Root-Workspace-APIs
 */
const fixHref = (resource: any, href: string) => {
  try {
    const PwCnf = getPaperbackWriterConfiguration()
    if (!href) {
      return href
    }

    // すでにURLになっている場合はhrefを使う
    const hrefUri = getVscodeUri(href)
    if (['http', 'https'].indexOf(hrefUri.scheme) >= 0) {
      return hrefUri.toString()
    }

    // ^ で始まる場合、ホームディレクトリの相対パスを使用する
    if (href.indexOf('~') === 0) {
      return getHomeDirPath(href)
    }

    // ファイルURIとしてhrefを使用する
    if (path.isAbsolute(href)) {
      return getPath(href)
    }

    // ワークスペースがあり、markdown-pdf.stylesRelativePathFileがfalseの場合、ワークスペース相対パスを使用する。
    const stylesRelativePathFile = PwCnf.stylesRelativePathFile
    let root = getWorkspaceFolder(resource)
    if (stylesRelativePathFile === false && root) {
      return getPath(path.join(root.uri.fsPath, href))
    }

    // マークダウン・ファイルからの相対参照
    return getPath(path.join(path.dirname(resource.fsPath), href))

  } catch (error) {
    showMessage({message: "fixHref()", type: 'error'})
  }
}
