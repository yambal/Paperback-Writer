import * as vscode from 'vscode'
import { PdfFormat, PdfOrientation } from './export/exportPdf'
import { PaperbackWriterOutputType } from './paperbackWriter'

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
  convertOnSave: boolean,
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
    convertOnSave: wsc['convertOnSave'],
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