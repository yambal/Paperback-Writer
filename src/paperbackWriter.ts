import path from "path"
import { getActiveTextEditor, getEditorDocumentLanguageId, getPaperbackWriterConfiguration, showMessage } from "./vscode"
import { markdownToHtml } from "./convert/markdown/markdownToHtml"
import { PuppeteerPdfOutputType, exportPdf } from "./export/pdf/exportPdf"
import { checkPuppeteerBinary } from "./checkPuppeteerBinary"
import { lunchPuppeteer } from "./lunchPuppeteer"
import * as vscode from 'vscode'
import { exportHtml } from "./export/exportHtml"
import { deleteFile, getOutputPathName } from "./util"
import { PuppeteerImageOutputType, exportImage } from "./export/exportImage"
import { styleTagBuilder } from "./convert/styles/styleTagBuilder"
import { buildFontQuerys } from "./convert/styles/css/fontStyle"
import { getHeaderFooterFontSize } from "./export/pdf/pdfHeaderFooterUtil"

/** このExtentionが出力できる拡張子 */
export type PaperbackWriterOutputType = PuppeteerPdfOutputType | PuppeteerImageOutputType | 'html'

/** 受け付けるコマンド */
export type PaperbackWriterCommandType = 'settings' | 'all' | PaperbackWriterOutputType

/** paperbackWriterのオプション */
export type paperbackWriterOptionType = {
  command: PaperbackWriterCommandType
}

export const paperbackWriter = async ({ command }: paperbackWriterOptionType) => {

  // ステータスバー
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)

  const pwConf = getPaperbackWriterConfiguration()
  const allOutputTypes: PaperbackWriterOutputType[] = ['html', 'pdf', 'png', 'jpeg']

  try {
    if (!checkPuppeteerBinary({pathToAnExternalChromium: pwConf.pathToAnExternalChromium})) {
      showMessage({
        message: `ChromiumまたはChromeが存在しません！`, // See https://github.com/yzane/vscode-markdown-pdf#install`,
        type: "warning"
      })
      return
    }

    const editor = getActiveTextEditor()
    if (!editor) {
      showMessage({
        message: 'No active Editor!',
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
        message: 'It is not a markdown mode!',
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
          message: 'markdownPdf().1 Supported formats: html, pdf, png, jpeg.',
          type: 'error'
        })
        return
    }
    if (!outputTypes) {
      return
    }

    statusBarItem.text = `$(paperbackwriter-logo) working...`
    statusBarItem.show()

    if (outputTypes && outputTypes.length > 0) {
      const editorText = editor.document.getText()

      /** 文章のタイトルはファイル名（拡張子抜き）とする */
      const docTitle = path.basename(editorCocPathName).split('.').slice(0, -1).join('.')
      const f = path.parse(editorCocPathName)
      const tmpfilename = path.join(f.dir, f.name + '_tmp.html')

      // スタイルタグを生成
      const styleTags  = styleTagBuilder({
        editorDocVsUrl,
        lineHeight: pwConf.style.typography.lineHeight,
        fontQuerys:buildFontQuerys(),
        codeTheme: {
          themeName: pwConf.style.syntaxHighlighting.themeName,
          showLineNumbers: pwConf.style.syntaxHighlighting.showLineNumbers
        }
      })

      statusBarItem.text = `$(paperbackwriter-logo) build html`
      return markdownToHtml({
        title: docTitle,
        markdownString: editorText,
        styleTags: styleTags,
        isAddBrOnSingleNewLine: pwConf.markdown.addBrOnSingleLineBreaks
      })
      .then((html) => {
        statusBarItem.text = `$(paperbackwriter-logo) save template html`
        return exportHtml({htmlString: html, exportPath:tmpfilename})
        .then((path) => {
          statusBarItem.text = `$(paperbackwriter-logo) lunch puppeteer`
          lunchPuppeteer(pwConf.pathToAnExternalChromium, vscode.env.language)
          .then((lunchedPuppeteer) => {
            statusBarItem.text = `$(paperbackwriter-logo) rendering`
            return lunchedPuppeteer.page.goto(vscode.Uri.file(tmpfilename).toString(), { waitUntil: 'networkidle0' })
            .then(() => {
              if (outputTypes) {
                const tasks = outputTypes.map((outputType, index) => {
                  statusBarItem.text = `$(paperbackwriter-logo) output ${outputType}`

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
                  statusBarItem.text = `$(paperbackwriter-logo) finish output. delete ${tmpfilename}`
                  deleteFile(tmpfilename)

                  statusBarItem.text = `$(paperbackwriter-logo) close puppeteer`
                  lunchedPuppeteer.browser.close()
                })
                .finally(() => {
                  statusBarItem.hide()
                })
              }
            })
          })
        })
      })
      
    }
  } catch (error) {
    console.error('paperbackWriter()', error)
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


