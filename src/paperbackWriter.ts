import path from "path"
import { getActiveTextEditor, getEditorDocumentLanguageId, getPaperbackWriterConfiguration, showMessage } from "./vscode-util"
import { markdownToHtml } from "./convert/markdownToHtml"
import { PuppeteerOutputType, exportPdf } from "./export/exportPdf"
import { checkPuppeteerBinary } from "./checkPuppeteerBinary"
import { lunchPuppeteer } from "./lunchPuppeteer"
import * as vscode from 'vscode'
import { exportHtml } from "./export/exportHtml"
import { deleteFile, getOutputDir } from "./util"


export type OutputType = PuppeteerOutputType | 'html'
type paperbackWriterOptionType = {
  command: 'settings' | 'all' | OutputType
}


export const paperbackWriter = async ({ command }: paperbackWriterOptionType) => {
  console.group(`paperbackWriter({ command: ${command} })`)

  const pwConf = getPaperbackWriterConfiguration()

  const typesFormat: OutputType[] = ['html', 'pdf', 'png', 'jpeg']

  try {
    if (!checkPuppeteerBinary()) {
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

    const editorDocumentUri = editor.document.uri
    const mdfilename = editorDocumentUri.fsPath
    const ext = path.extname(mdfilename)

    var editorDocumentLanguageId = getEditorDocumentLanguageId()
    if (editorDocumentLanguageId !== 'markdown' && editorDocumentLanguageId !== 'html') {
      showMessage({
        message: 'It is not a markdown mode!',
        type: 'warning'
      })
      return
    }

    // 出力を設定
    let outputTypes: OutputType[] | undefined = undefined
    switch (command) {
      case 'settings':
        outputTypes = paperbackWriterSetting() || ['pdf']
        break

      case 'pdf':
        outputTypes = ['pdf']
        break

      case 'all':
        outputTypes = typesFormat
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
      const f = path.parse(mdfilename)
      const tmpfilename = path.join(f.dir, f.name + '_tmp.html')

      return markdownToHtml({markdownString: editorText})
      .then((html) => {
        return exportHtml({htmlString: html, exportPath:tmpfilename})
        .then((path) => {
          lunchPuppeteer(pwConf.executablePath, vscode.env.language)
          .then((lunchedPuppeteer) => {
            return lunchedPuppeteer.page.goto(vscode.Uri.file(tmpfilename).toString(), { waitUntil: 'networkidle0' })
            .then(() => {
              if (outputTypes) {
                const tasks = outputTypes.map((outputType, index) => {
                  console.log(`${index + 1}/${outputTypes?.length} (${mdfilename}) : ${editorDocumentLanguageId} -> ${outputType}`)
                  const outputFilename = mdfilename.replace(ext, '.' + outputType)
    
                  if (editorDocumentLanguageId === "markdown" && outputType === 'html') {
                    return exportHtml({htmlString: html, exportPath: outputFilename})
    
                  } else if (editorDocumentLanguageId === "markdown" && outputType !== 'html') {      
                    /** @todo 外だし */
                    var exportFilename = getOutputDir(outputFilename, editorDocumentUri)
                    if (!exportFilename) {
                      return
                    }

                    return exportPdf({
                      outputType,
                      lunchedPuppeteerPage: lunchedPuppeteer.page,
                      exportFilename,
                      pdfOption: {
                        scale: pwConf.scale,
                        isDisplayHeaderAndFooter: pwConf.displayHeaderFooter,
                        headerTemplate: pwConf.headerTemplate,
                        footerTemplate: pwConf.footerTemplate,
                        isPrintBackground: pwConf.printBackground,
                        orientationIsLandscape: pwConf.orientation === 'landscape',
                        pageRanges: pwConf.pageRanges,
                        format: pwConf.format,
                        width: pwConf.width,
                        height: pwConf.height,
                        margin: {
                          top: pwConf.margin.top,
                          right: pwConf.margin.right,
                          bottom: pwConf.margin.bottom,
                          left: pwConf.margin.left
                        }
                      },
                      imageOption: {
                        quality: pwConf.quality,
                        clip: {
                          x: pwConf.clip.x,
                          y: pwConf.clip.y,
                          width: pwConf.clip.width,
                          height: pwConf.clip.height
                        },
                        omitBackground: pwConf.omitBackground,
                        fullPage: false
                      }

                    })
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

const paperbackWriterSetting = (): OutputType[] => {
  const pwConf = getPaperbackWriterConfiguration()

  var tempConfigurationType = pwConf.type
  console.log('paperbackWriterSetting', tempConfigurationType)

  if (tempConfigurationType && !Array.isArray(tempConfigurationType)) {
    return [tempConfigurationType]

  } else {
    return tempConfigurationType as OutputType[]
  }
} 