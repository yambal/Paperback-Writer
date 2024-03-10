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
  output: {
    types: PaperbackWriterOutputType[]
    directory: string
    directoryRelativePathFile: boolean
    auto: boolean
    listOfFileNamesExcludedFromAuto: string[]
  }

  style: {
    includeDefaultStyle: boolean
    font: {
      baseSize: number
      baseFont: "" | "Noto Sans : CY,JA,LA,VI" | "Noto Serif : CY,JA,LA,VI" | "Roboto : CY,GR,LA,VI" | "BIZ UDPGothic : JA,(CY,LA)" | "BIZ UDPMincho : JA,(CY,LA)"
      codeFont: "Source Code Pro : Code"
    }
    customCSS: string[]
    customCSSRelativePathFile: boolean
  }

  markdown: {
    addBrOnSingleLineBreaks: boolean
  }

  pathToAnExternalChromium: string
  renderScale: number
  PDF: {
    displayHeaderFooter: boolean
    headerHtmlElementTemplate: string
    footerHtmlElementTemplate: string
    printBackground: boolean
    paperOrientation: PdfOrientation
    pageRanges: string
    paperSizeFormat?: PdfFormat
    paperWidth: string
    paperHeight: string
    margin: {
      top: string
      right: string
      bottom: string
      left: string
    }
  }
  image: {
    jpeg: {
      quality: number
    }
    clip: {
      x: number | null
      y: number | null
      width: number | null
      height: number | null
    },
    omitBackground: boolean
  } 

  StatusbarMessageTimeout: number

  
  
  
}

/** 設定を得る */
export const getPaperbackWriterConfiguration = (scope?: vscode.ConfigurationScope | null | undefined): PaperbackWriterConfiguration => {
  const wsc = vscode.workspace.getConfiguration('paperback-writer', scope)
  
  const pwf: PaperbackWriterConfiguration = {
    output: {
      types: wsc['output']['types'],
      directory: wsc['output']['directory'],
      directoryRelativePathFile: wsc['output']['directoryRelativePathFile'],
      auto: wsc['output']['auto'],
      listOfFileNamesExcludedFromAuto: wsc['output']['listOfFileNamesExcludedFromAuto']
    },

    style: {
      includeDefaultStyle: wsc['style']['includeDefaultStyle'],
      font: {
        baseSize: wsc['style']['font']['baseSize'],
        baseFont: wsc['style']['font']['baseFont'],
        codeFont: wsc['style']['font']['codeFont'],
      },
      customCSS: wsc['style']['customCSS'],
      customCSSRelativePathFile: wsc['style']['customCSSRelativePathFile'],
    },

    markdown: {
      addBrOnSingleLineBreaks: wsc['markdown']['addBrOnSingleLineBreaks'],
    },
    
    pathToAnExternalChromium: wsc['pathToAnExternalChromium'],
    renderScale: wsc['renderScale'],
    PDF: {
      displayHeaderFooter: wsc['PDF']['displayHeaderFooter'],
      headerHtmlElementTemplate: wsc['PDF']['headerHtmlElementTemplate'],
      footerHtmlElementTemplate: wsc['PDF']['footerHtmlElementTemplate'],
      printBackground: wsc['PDF']['printBackground'],
      paperOrientation: wsc['PDF']['paperOrientation'],
      pageRanges: wsc['PDF']['pageRanges'],
      paperSizeFormat: wsc['PDF']['paperSizeFormat'],
      paperWidth: wsc['PDF']['paperWidth'],
      paperHeight: wsc['PDF']['paperHeight'],
      margin: {
        top: wsc['PDF']['margin']['top'],
        right: wsc['PDF']['margin']['right'],
        bottom: wsc['PDF']['margin']['bottom'],
        left: wsc['PDF']['margin']['left']
      },
    },
    image: {
      jpeg: {
        quality: wsc['image']['jpeg']['quality']
      },
      clip: {
        x: wsc['image']['clip']['x'],
        y: wsc['image']['clip']['y'],
        width:  wsc['image']['clip']['width'],
        height: wsc['image']['clip']['height']
      },
      omitBackground: wsc['image']['omitBackground'],
    },

    StatusbarMessageTimeout: 10000,
    
    
    
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