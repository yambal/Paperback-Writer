import * as vscode from 'vscode'
import { PdfFormat, PdfOrientation } from './export/exportPdf'
import { PaperbackWriterOutputType } from './paperbackWriter'
var os = require('os')

import localeEn from "../package.nls.json"
import localeJa from "../package.nls.ja.json"

// ------------------------------
// 言語辞書
type Nls = {
  "extension.paperback-writer.settings": string
  "extension.paperback-writer.pdf": string
  "extension.paperback-writer.png": string
  "extension.paperback-writer.jpeg": string
  "extension.paperback-writer.html": string
  "extension.paperback-writer.all": string
  "paperback-writer.isConvertOnSave": string
  "paperback-writer.convertOnSaveExclude": string
  "paperback-writer.outputDirectory": string
  "paperback-writer.outputDirectoryRelativePathFile": string

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

// ------------------------------

/**
 * メッセージの種類
 */
export type MessageType = "error" | "warning" | "info" | "log"

/**
 * メッセージを表示する
 */
export type ShowMessageProps = {
  /** 表示メッセージ */
  message: string,
  /** メッセージの種類 */
  type: MessageType
}
export const showMessage = ({
  message,
  type
}: ShowMessageProps) => {

  switch (type) {
    case "error":
      vscode.window.showErrorMessage(message)
      break
    case "warning":
      vscode.window.showWarningMessage(message)
      break
    case "info":
      vscode.window.showInformationMessage(message)
      break
    case "log":
      console.log(message)
      break
    default:
      vscode.window.showInformationMessage(message)
      break
  }
}

export const getActiveTextEditor = ():vscode.TextEditor | undefined => {
  return vscode.window.activeTextEditor
}

export const getEditorDocumentLanguageId = (): string | undefined => {
  var editor = getActiveTextEditor()
  if (editor) {
    return editor.document.languageId
  }
  return undefined
}

export const getWorkspaceFolder = (uri: vscode.Uri): vscode.WorkspaceFolder | undefined => {
  return vscode.workspace.getWorkspaceFolder(uri)
}

type PaperbackWriterConfiguration = {
  type: PaperbackWriterOutputType[],
  isConvertOnSave: boolean,
  convertOnSaveExclude: string[]
  outputDirectory: string
  outputDirectoryRelativePathFile: boolean
  styles: string[]
  stylesRelativePathFile: boolean
  includeDefaultStyles: boolean
  highlight: boolean
  highlightStyle: string | null
  breaks: boolean
  emoji: boolean
  executablePath: string
  scale: number
  displayHeaderFooter: boolean
  headerTemplate: string
  footerTemplate: string
  printBackground: boolean
  orientation: PdfOrientation
  pageRanges: string

  /** ページのフォーマット */
  format?: PdfFormat
  width: string
  height: string
  margin: {
    top: string
    right: string
    bottom: string
    left: string
  }

  /** 画像の品質 */
  quality: number

  /** クリップ範囲 */
  clip: {
    x: number | null
    y: number | null
    width: number | null
    height: number | null
  },

  /** 背景の省略 */
  omitBackground: boolean
  plantumlOpenMarker: string
  plantumlCloseMarker: string
  plantumlServer: string
  StatusbarMessageTimeout: number
  mermaidServer: string
}

export const getPaperbackWriterConfiguration = (scope?: vscode.ConfigurationScope | null | undefined): PaperbackWriterConfiguration => {
  const wsc = vscode.workspace.getConfiguration('paperback-writer', scope)
  
  const pwf: PaperbackWriterConfiguration = {
    type: wsc['type'],
    isConvertOnSave: wsc['isConvertOnSave'],
    convertOnSaveExclude: wsc['convertOnSaveExclude'],
    outputDirectory: wsc['outputDirectory'],
    outputDirectoryRelativePathFile: wsc['outputDirectoryRelativePathFile'],
    styles: wsc['styles'],
    stylesRelativePathFile: wsc['stylesRelativePathFile'],
    includeDefaultStyles: wsc['includeDefaultStyles'],
    highlight: wsc['highlight'],
    highlightStyle: wsc['highlightStyle'],
    breaks: wsc['breaks'],
    emoji: wsc['emoji'],
    executablePath: wsc['executablePath'],
    scale: wsc['scale'],
    displayHeaderFooter: wsc['displayHeaderFooter'],
    headerTemplate: wsc['headerTemplate'],
    footerTemplate: wsc['footerTemplate'],
    printBackground: wsc['printBackground'],
    orientation: wsc['orientation'],
    pageRanges: wsc['pageRanges'],
    format: wsc['format'],
    width: wsc['width'],
    height: wsc['height'],
    margin: {
      top: wsc['margin']['top'],
      right: wsc['margin']['right'],
      bottom: wsc['margin']['bottom'],
      left: wsc['margin']['left']
    },
    quality: wsc['quality'],
    clip: {
      x: wsc['clip']['x'],
      y: wsc['clip']['y'],
      width:  wsc['clip']['width'],
      height: wsc['clip']['height']
    },
    omitBackground: wsc['omitBackground'],
    plantumlOpenMarker: wsc['plantumlOpenMarker'],
    plantumlCloseMarker: wsc['plantumlCloseMarker'],
    plantumlServer: wsc['plantumlServer'],
    StatusbarMessageTimeout: wsc['StatusbarMessageTimeout'],
    mermaidServer: wsc['mermaidServer']
  }

  const margin = wsc['margin']
  
  return pwf
}

/** 入力から vscode.Uri を得る */
export const getVscodeUri = (href: string):vscode.Uri => {
  return vscode.Uri.parse(href)
}

export const getPath = (href: string):string => {
  return vscode.Uri.file(href).toString()
}

export const getHomeDirPath = (href: string):string => {
  return getPath(href.replace(/^~/, os.homedir()))
}


