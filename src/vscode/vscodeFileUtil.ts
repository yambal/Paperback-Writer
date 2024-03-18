import * as vscode from 'vscode'

var os = require('os')

import localeEn from "../../package.nls.json"
import localeJa from "../../package.nls.ja.json"
import {  } from '../convert/markdown/customRenderer/customRendererCodeBlockCSSGenerator'

import { VscodeEnvLanguage } from './types'

// ------------------------------
// 言語辞書
type Nls = {
  "extension.paperback-writer.settings": string
  "extension.paperback-writer.pdf": string
  "extension.paperback-writer.png": string
  "extension.paperback-writer.jpeg": string
  "extension.paperback-writer.html": string
  "extension.paperback-writer.all": string
  "paperback-writer.output.auto.dsc": string
  "paperback-writer.output.listOfFileNamesExcludedFromAuto.dsc": string
  "paperback-writer.output.directory.dsc": string
  "paperback-writer.output.directoryRelativePathFile.dsc": string

  "markdown-pdf.outputDirector.notExist": string
}
export const getLang = () => {
  return vscode.env.language
}

export const getNls = ():Nls => {
  const lang = getLang()
  switch (lang) {
    case "ja":
      return localeJa as Nls
    default:
      return localeEn as Nls
  }
}

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