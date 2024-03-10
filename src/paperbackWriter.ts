import path from "path"
import { getActiveTextEditor, getEditorDocumentLanguageId, getPaperbackWriterConfiguration, showMessage } from "./vscode-util"
import { markdownToHtml } from "./convert/markdown/markdownToHtml"
import { PuppeteerPdfOutputType, exportPdf } from "./export/exportPdf"
import { checkPuppeteerBinary } from "./checkPuppeteerBinary"
import { lunchPuppeteer } from "./lunchPuppeteer"
import * as vscode from 'vscode'
import { exportHtml } from "./export/exportHtml"
import { deleteFile, getOutputPathName } from "./util"
import { PuppeteerImageOutputType, exportImage } from "./export/exportImage"
import { styleTagBuilder } from "./convert/styles/styleTagBuilder"
import { buildFontQuerys } from "./convert/styles/css/fontStyle"

/** このExtentionが出力できる拡張子 */
export type PaperbackWriterOutputType = PuppeteerPdfOutputType | PuppeteerImageOutputType | 'html'

/** 受け付けるコマンド */
export type PaperbackWriterCommandType = 'settings' | 'all' | PaperbackWriterOutputType

/** paperbackWriterのオプション */
export type paperbackWriterOptionType = {
  command: PaperbackWriterCommandType
}

export const paperbackWriter = async ({ command }: paperbackWriterOptionType) => {
  console.group(`paperbackWriter({ command: ${command} })`)

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
        outputTypes = pwConf.outputTypes || ['pdf']
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

    console.log(`outputTypes: ${outputTypes}`)

    if (outputTypes && outputTypes.length > 0) {
      const editorText = editor.document.getText()
      const f = path.parse(editorCocPathName)
      const tmpfilename = path.join(f.dir, f.name + '_tmp.html')

      // スタイルタグを生成
      const styleTags  = styleTagBuilder({
        editorDocVsUrl, 
        fontQuerys:buildFontQuerys()
      })

      return markdownToHtml({
        markdownString: editorText,
        styleTags: styleTags,
        isAddBrOnSingleNewLine: pwConf.addBrOnSingleLineBreaksInMarkdown
      })
      .then((html) => {
        return exportHtml({htmlString: html, exportPath:tmpfilename})
        .then((path) => {
          lunchPuppeteer(pwConf.pathToAnExternalChromium, vscode.env.language)
          .then((lunchedPuppeteer) => {
            return lunchedPuppeteer.page.goto(vscode.Uri.file(tmpfilename).toString(), { waitUntil: 'networkidle0' })
            .then(() => {
              if (outputTypes) {
                const tasks = outputTypes.map((outputType, index) => {
                  console.log(`${index + 1}/${outputTypes?.length} (${editorCocPathName}) : ${editorDocumentLanguageId} -> ${outputType}`)
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

                    console.group()
                    console.log('outputPathName: ', editorCocPathName)
                    console.log('outputPathName > ', outputPathName)
                    console.log('editorDocVsUrl >', editorDocVsUrl)
                    console.log(' > exportPathName', exportPathName)
                    console.groupEnd

                    if (outputType === 'png' || outputType === 'jpeg') {
                      return exportImage({
                        outputType,
                        lunchedPuppeteerPage: lunchedPuppeteer.page,
                        exportPathName,
                        imageOption: {
                          quality: pwConf.quality,
                          clip: pwConf.clip,
                          omitBackground: pwConf.omitBackground,
                          fullPage: false
                        }
                      })
                    }

                    if (outputType === 'pdf') {
                      return exportPdf({
                        lunchedPuppeteerPage: lunchedPuppeteer.page,
                        exportPathName,
                        pdfOption: {
                          scale: pwConf.renderScale,
                          isDisplayHeaderAndFooter: pwConf.pdfDisplayHeaderFooter,
                          headerTemplate: pwConf.pdfHeaderHtmlElementTemplate,
                          footerTemplate: pwConf.pdfFooterHtmlElementTemplate,
                          isPrintBackground: pwConf.pdfPrintBackground,
                          orientationIsLandscape: pwConf.pdfPaperOrientation === 'landscape',
                          pageRanges: pwConf.pdfPageRanges,
                          format: pwConf.pdfPaperSizeFormat,
                          width: pwConf.pdfPaperWidth,
                          height: pwConf.height,
                          margin: pwConf.margin
                        }
                      })
                    }
                  } else {
                    return null
                  }
                })
    
                Promise.all(tasks)
                .then(() => {
                  deleteFile(tmpfilename)
                  lunchedPuppeteer.browser.close()
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
			const excludePatterns = PwCnf.listOfFileNamesExcludedFromAutoOutput || ''
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


