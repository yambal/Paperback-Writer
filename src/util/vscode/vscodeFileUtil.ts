import * as vscode from 'vscode'
import { VscodeEnvLanguage } from '.'

var os = require('os')

export const getActiveTextEditor = ():vscode.TextEditor | undefined => {
  return vscode.window.activeTextEditor
}

/** 入力から vscode.Uri を得る */
export const getVscodeUri = (href: string):vscode.Uri => {
  return vscode.Uri.parse(href)
}

/** 文字列から vscode.Uri を得る */
export const getUri = (href: string):vscode.Uri => {
  return vscode.Uri.file(href)
}

/** 文字列から URIの文字列表現を返す */
export const getPath = (href: string):string => {
  return getUri(href).toString()
}

/** OSホームを返す */
export const getHomeDirPath = (href: string):string => {
  return getPath(href.replace(/^~/, os.homedir()))
}

/** VSCodeの言語設定を得る */
export const getEnvLanguage = (): VscodeEnvLanguage => {
  return vscode.env.language as VscodeEnvLanguage
}

export const getWorkspaceFolder = (uri: vscode.Uri): vscode.WorkspaceFolder | undefined => {
  return vscode.workspace.getWorkspaceFolder(uri)
}

export const getEditorDocumentLanguageId = (): string | undefined => {
  var editor = getActiveTextEditor()
  if (editor) {
    return editor.document.languageId
  }
  return undefined
}