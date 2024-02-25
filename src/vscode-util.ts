import * as vscode from 'vscode'

export const showErrorMessage = (msg: string, error: any) => {
  vscode.window.showErrorMessage('ERROR: ' + msg)
  console.log('ERROR: ' + msg)
  if (error) {
    vscode.window.showErrorMessage(error.toString())
    console.log(error)
  }
}

export const showInformationMessage = (title: string, msg: any) => {
  vscode.window.showInformationMessage(`${title}: ${msg}`)
  console.log(`${title}: ${msg}`)
}

export const showWarningMessage = (title: string, msg: any) => {
  vscode.window.showWarningMessage(`${title}: ${msg}`)
  console.log(`${title}: ${msg}`)
}

export const getActiveTextEditor = ():vscode.TextEditor | undefined => {
  return vscode.window.activeTextEditor
}

export const getLanguageId = (): string | undefined => {
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
  type: string[],
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
  orientation: "portrait" | "landscape"
  pageRanges: string
  format: "Letter" | "Legal" | "Tabloid" | "Ledger" | "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6"
  width: string
  height: string
  margin: {
    top: string
    right: string
    bottom: string
    left: string
  }
  quality: number
  clip: {
    x: number | null
    y: number | null
    width: number | null
    height: number | null
  },
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



export const getConfiguration = (item: string, fallbackValue?: string | undefined, section?: string | undefined, ) => {
 return vscode.workspace.getConfiguration(section)[item] || fallbackValue || undefined
}

export const getExecutablePath = ():string => {
  return getPaperbackWriterConfiguration()['executablePath'] as PaperbackWriterConfiguration['executablePath']
}

