import * as vscode from 'vscode'
import { PdfOrientation } from '../export/pdf/exportPdf'
import { PaperbackWriterOutputType } from '../paperbackWriter'
import { PaperFormat } from 'puppeteer'
import { HeaderFooterItems } from '../export/pdf/pdfHeaderFooterUtil'
import { CodeThemeName } from '../convert/markdown/customRenderer/customRendererCodeBlockThemeCSSGenerator'

type HeaderFooterFontSize = "50%" | "60%" | "70%" | "80%" | "90%"

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
      
    }
    customCSS: string[]
    customCSSRelativePathFile: boolean
    syntaxHighlighting: {
      font: "Source Code Pro : Code"
      showLineNumbers: boolean
      themeName: CodeThemeName | ""
    }
    typography: {
      lineHeight: number
      h1HeaderScale: number
    }
  }

  markdown: {
    addBrOnSingleLineBreaks: boolean
  }

  pathToAnExternalChromium: string
  renderScale: number
  PDF: {
    displayHeaderFooter: boolean
    header: {
      items: HeaderFooterItems[]
      fontSize: HeaderFooterFontSize
      margin: string
    }
    footer: {
      items: HeaderFooterItems[]
      fontSize: HeaderFooterFontSize
      margin: string
    }
    printBackground: boolean
    paperOrientation: PdfOrientation
    pageRanges: string
    paperSizeFormat?: PaperFormat
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

  const paperSizeFormat = !wsc['PDF']['paperSizeFormat'] || wsc['PDF']['paperSizeFormat'].length === 0 ? undefined : wsc['PDF']['paperSizeFormat']

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
      },
      customCSS: wsc['style']['customCSS'],
      customCSSRelativePathFile: wsc['style']['customCSSRelativePathFile'],
      typography: {
        lineHeight: wsc['style']['typography']['lineHeight'],
        h1HeaderScale: wsc['style']['typography']['h1HeaderScale'],
      },
      syntaxHighlighting: {
        font: wsc['style']['syntaxHighlighting']['font'],
        showLineNumbers: wsc['style']['syntaxHighlighting']['showLineNumbers'],
        themeName: wsc['style']['syntaxHighlighting']['theme']
      }
    },

    markdown: {
      addBrOnSingleLineBreaks: wsc['markdown']['addBrOnSingleLineBreaks'],
    },
    
    pathToAnExternalChromium: wsc['pathToAnExternalChromium'],
    renderScale: wsc['renderScale'],
    PDF: {
      displayHeaderFooter: wsc['PDF']['displayHeaderFooter'],
      header: {
        items: wsc['PDF']['header']['items'],
        fontSize: wsc['PDF']['header']['fontSize'],
        margin: wsc['PDF']['header']['margin']
      },
      footer: {
        items: wsc['PDF']['footer']['items'],
        fontSize: wsc['PDF']['footer']['fontSize'],
        margin: wsc['PDF']['footer']['margin']
      },
      printBackground: wsc['PDF']['printBackground'],
      paperOrientation: wsc['PDF']['paperOrientation'],
      pageRanges: wsc['PDF']['pageRanges'],
      paperSizeFormat,
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