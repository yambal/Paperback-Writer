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
  "paperback-writer.autoOutput.dsc": string
  "paperback-writer.listOfFileNamesExcludedFromAutoOutput.dsc": string
  "paperback-writer.outputDirectory.dsc": string
  "paperback-writer.outputDirectoryRelativePathFile.dsc": string

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

type PaperbackWriterConfiguration = {
  outputTypes: PaperbackWriterOutputType[],
  autoOutput: boolean,
  listOfFileNamesExcludedFromAutoOutput: string[]
  outputDirectory: string
  outputDirectoryRelativePathFile: boolean
  customCSS: string[]
  customCSSRelativePathFile: boolean
  includeDefaultStyles: boolean

  addBrOnSingleLineBreaksInMarkdown: boolean

  pathToAnExternalChromium: string
  renderScale: number
  displayHeaderFooter: boolean
  headerHtmlElementTemplate: string
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

  StatusbarMessageTimeout: number

  baseFont: "" | "Noto Sans : CY,JA,LA,VI" | "Noto Serif : CY,JA,LA,VI" | "Roboto : CY,GR,LA,VI" | "BIZ UDPGothic : JA,(CY,LA)" | "BIZ UDPMincho : JA,(CY,LA)"
  codeFont: "Source Code Pro : Code"
  baseFontSize: number
}

/** 設定を得る */
export const getPaperbackWriterConfiguration = (scope?: vscode.ConfigurationScope | null | undefined): PaperbackWriterConfiguration => {
  const wsc = vscode.workspace.getConfiguration('paperback-writer', scope)
  
  const pwf: PaperbackWriterConfiguration = {
    outputTypes: wsc['outputTypes'],
    autoOutput: wsc['autoOutput'],
    listOfFileNamesExcludedFromAutoOutput: wsc['listOfFileNamesExcludedFromAutoOutput'],
    outputDirectory: wsc['outputDirectory'],
    outputDirectoryRelativePathFile: wsc['outputDirectoryRelativePathFile'],
    customCSS: wsc['customCSS'],
    customCSSRelativePathFile: wsc['customCSSRelativePathFile'],
    includeDefaultStyles: wsc['includeDefaultStyles'],
    addBrOnSingleLineBreaksInMarkdown: wsc['addBrOnSingleLineBreaksInMarkdown'],
    pathToAnExternalChromium: wsc['pathToAnExternalChromium'],
    renderScale: wsc['renderScale'],
    displayHeaderFooter: wsc['displayHeaderFooter'],
    headerHtmlElementTemplate: wsc['headerHtmlElementTemplate'],
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
    StatusbarMessageTimeout: 10000,
    baseFont: wsc['baseFont'],
    codeFont: wsc['codeFont'],
    baseFontSize: wsc['baseFontSize']
  }
  
  return pwf
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
export type VscodeEnvLanguage = "en" | "zh-cn" | "zh-tw" | "fr" | "de" | "it" | "es" | "ja" | "ko" | "ru" | "pt-br" | "tr" | "pl" | "cs" | "hu"
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