import path from "path"
import {
  getActiveTextEditor,
  getEditorDocumentLanguageId,
  getPaperbackWriterConfiguration,
  showMessage,
  deleteFile,
  getOutputPathName,
  getNls
} from "./util"
import { PuppeteerPdfOutputType, exportPdf } from "./export/pdf/exportPdf"
import { checkPuppeteerBinary } from "./checkPuppeteerBinary"
import { lunchPuppeteer } from "./lunchPuppeteer"
import * as vscode from 'vscode'
import { exportHtml } from "./export/exportHtml"
import { PuppeteerImageOutputType, exportImage } from "./export/exportImage"
import { getHeaderFooterFontSize } from "./export/pdf/pdfHeaderFooterUtil"
import { htmlBuilder } from "./convert/htmlBuilder"

/** このExtentionが出力できる拡張子 */
export type PaperbackWriterOutputType = PuppeteerPdfOutputType | PuppeteerImageOutputType | 'html'

/** 受け付けるコマンド */
export type PaperbackWriterCommandType = 'settings' | 'all' | PaperbackWriterOutputType

/** paperbackWriterのオプション */
export type paperbackWriterOptionType = {
  command: PaperbackWriterCommandType
}

const addIcon = (text: string) => {
  return `$(paperbackwriter-logo) ${text}`
}

export const paperbackWriter = async ({ command }: paperbackWriterOptionType) => {
  const nls = getNls()
  // ステータスバー
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)

  const pwConf = getPaperbackWriterConfiguration()
  const allOutputTypes: PaperbackWriterOutputType[] = ['html', 'pdf', 'png', 'jpeg']

  try {
    if (!checkPuppeteerBinary({pathToAnExternalChromium: pwConf.pathToAnExternalChromium})) {
      showMessage({
        message: nls["Chromium or Chrome is not found!"], // See https://github.com/yzane/vscode-markdown-pdf#install`,
        type: "error"
      })
      return
    }

    const editor = getActiveTextEditor()
    if (!editor) {
      showMessage({
        message: nls["The editor is not active."],
        type: 'warning'
      })
      return
    }

    const editorDocVsUrl = editor.document.uri
    const editorCocPathName = editorDocVsUrl.fsPath
    const ext = path.extname(editorCocPathName)

    var editorDocumentLanguageId = getEditorDocumentLanguageId()
    if (editorDocumentLanguageId !== 'markdown' && editorDocumentLanguageId !== 'html') {
      showMessage({
        message: nls["Markdown file is not active in the editor"],
        type: 'warning'
      })
      return
    }

    // 出力を設定
    let outputTypes: PaperbackWriterOutputType[] | undefined
    switch (command) {
      case 'settings':
        outputTypes = pwConf.output.types || ['pdf']
        break

      case 'pdf':
        outputTypes = ['pdf']
        break

      case 'png':
          outputTypes = ['png']
          break
      
      case 'jpeg':
        outputTypes = ['jpeg']
        break

      case 'html':
        outputTypes = ['html']
        break

      case 'all':
        outputTypes = allOutputTypes
        break

      default:
        showMessage({
          message: nls["Support outputting in the formats of HTML, PDF, PNG, and JPEG"],
          type: 'error'
        })
        return
    }
    if (!outputTypes) {
      return
    }

    
    statusBarItem.text = addIcon(nls["working..."])
    statusBarItem.show()

    if (outputTypes && outputTypes.length > 0) {
      const editorText = editor.document.getText()

      /** 文章のタイトルはファイル名（拡張子抜き）とする */
      const docTitle = path.basename(editorCocPathName).split('.').slice(0, -1).join('.')
      const f = path.parse(editorCocPathName)
      const tmpfilename = path.join(f.dir, f.name + '_tmp.html')

      statusBarItem.text = addIcon(nls["Parsing Markdown"])
      return htmlBuilder({
        title: docTitle,
        markdownProps: {
          markdownString: editorText,
          isAddBrOnSingleNewLine: pwConf.markdown.addBrOnSingleLineBreaks,
        },
        buildInStyleTagBuilderProps: {
          baseFontSize: pwConf.style.font.baseSize,
          lineHeight: pwConf.style.typography.lineHeight,
          codeTheme: {
            themeName: pwConf.style.syntaxHighlighting.themeName,
            showLineNumbers: pwConf.style.syntaxHighlighting.showLineNumbers
          },
          h1HeaderScale: pwConf.style.typography.h1HeaderScale
        },
        fontStyleTagsBuilderProps: {
          baseFont: pwConf.style.font.baseFont,
          syntaxHighlightingFont: pwConf.style.syntaxHighlighting.font,
        },
        userStyleTagsBuilderProps: {
          editorDocVsUrl,
          userCustomCss: pwConf.style.customCSS
        },
        includeDefaultStyles: pwConf.style.includeDefaultStyle
      })
      .then((html) => {
        statusBarItem.text = addIcon(nls["Saving temporary files"] + ` ${tmpfilename}`)

        return exportHtml({htmlString: html, exportPath:tmpfilename})

        .then((path) => {
          statusBarItem.text = addIcon(nls["Starting renderer (Puppeteer)"])
          lunchPuppeteer(pwConf.pathToAnExternalChromium, vscode.env.language)
          .then((lunchedPuppeteer) => {
            statusBarItem.text = addIcon(nls["Rendering"])
            return lunchedPuppeteer.page.goto(vscode.Uri.file(tmpfilename).toString(), { waitUntil: 'networkidle0' })
            .then(() => {
              if (outputTypes) {
                statusBarItem.text = addIcon(nls.Outputting + ` (${outputTypes.join(', ')})`)
                const tasks = outputTypes.map((outputType, index) => {
                 
                  const outputPathName = editorCocPathName.replace(ext, '.' + outputType)
    
                  if (editorDocumentLanguageId === "markdown" && outputType === 'html') {
                    
                    return exportHtml({htmlString: html, exportPath: outputPathName})
    
                  } else if (editorDocumentLanguageId === "markdown" && outputType !== 'html') {      

                    const exportPathName = getOutputPathName({
                      outputPathName,
                      editorDocVsUrl
                    })

                    if (!exportPathName) {
                      return
                    }

                    if (outputType === 'png' || outputType === 'jpeg') {
                      return exportImage({
                        outputType,
                        lunchedPuppeteerPage: lunchedPuppeteer.page,
                        exportPathName,
                        imageOption: {
                          quality: pwConf.image.jpeg.quality,
                          clip: pwConf.image.clip,
                          omitBackground: pwConf.image.omitBackground,
                          fullPage: false
                        }
                      })
                    }

                    if (outputType === 'pdf') {

                      const width = pwConf.PDF.paperWidth && pwConf.PDF.paperWidth.length > 0 ? pwConf.PDF.paperWidth : undefined
                      const height = pwConf.PDF.paperHeight && pwConf.PDF.paperHeight.length > 0 ? pwConf.PDF.paperHeight : undefined
                      const format = width && height ? undefined : pwConf.PDF.paperSizeFormat

                      return exportPdf({
                        lunchedPuppeteerPage: lunchedPuppeteer.page,
                        exportPathName,
                        pdfOption: {
                          scale: pwConf.renderScale,
                          displayHeaderFooter: pwConf.PDF.displayHeaderFooter,
                          printBackground: pwConf.PDF.printBackground,
                          landscape: pwConf.PDF.paperOrientation === 'landscape',
                          pageRanges: pwConf.PDF.pageRanges,
                          format: format,
                          width: width,
                          height: height,
                          margin: pwConf.PDF.margin
                        },
                        headerProps: {
                          fontSize: getHeaderFooterFontSize({baseFontSize: pwConf.style.font.baseSize, rate: pwConf.PDF.header.fontSize}),
                          headerItems: pwConf.PDF.header.items,
                          headerMargin: pwConf.PDF.header.margin
                        },
                        footerProps: {
                          fontSize: getHeaderFooterFontSize({baseFontSize: pwConf.style.font.baseSize, rate: pwConf.PDF.footer.fontSize}),
                          footerItems: pwConf.PDF.footer.items,
                          footerMargin: pwConf.PDF.footer.margin
                        }
                      })
                    }
                  } else {
                    return null
                  }
                })
                Promise.all(tasks)
                .then(() => {
                  statusBarItem.text =  statusBarItem.text = addIcon(nls["Deleting temporary files"] + `${tmpfilename}`)
                  deleteFile(tmpfilename)

                  statusBarItem.text = addIcon(nls["Shutting down renderer (Puppeteer)"])
                  lunchedPuppeteer.browser.close()

                  showMessage({ message: nls["Finishing export"], type: 'info' })
                })
                .finally(() => {
                  statusBarItem.text = addIcon(nls["Finishing export"])
                  setTimeout(() => {
                    statusBarItem.hide()
                  }, 3000)
                })
              }
            })
          })
        })
      })      
    }
  } catch (error) {
    console.error('error ', error)
  } finally { 

    console.groupEnd()
  }
}

// -------------------------------------------------------------------------------
/** 自動保存 */
export const autoSave = () => {
  try {
    var mode = getEditorDocumentLanguageId()
    if (mode != 'markdown') {
      return
    }

    if (!isMarkdownPdfOnSaveExclude()) {
      paperbackWriter({command: 'settings'})
    }

  } catch (error) {
		showMessage({message: "markdownPdfOnSave", type: 'error'})
  }
}

/** 除外ルールに抵触するものを返す */
const isMarkdownPdfOnSaveExclude = () => {
  try{
		const PwCnf = getPaperbackWriterConfiguration()
    var editor = getActiveTextEditor()

		if (editor) {
			const filename = path.basename(editor.document.fileName)
			const excludePatterns = PwCnf.output.listOfFileNamesExcludedFromAuto || ''
			if (excludePatterns && Array.isArray(excludePatterns) && excludePatterns.length > 0) {
				return excludePatterns.find((excludePattern) => {
					var re = new RegExp(excludePattern)
					return re.test(filename)
				})
			}
		}
		return false
  } catch (error) {
    showMessage({message: "isMarkdownPdfOnSaveExclude", type: 'error'})
  }
}


