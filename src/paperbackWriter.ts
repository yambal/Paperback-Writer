import path from "path"
import { getActiveTextEditor, getEditorDocumentLanguageId, getPaperbackWriterConfiguration, showMessage } from "./vscode-util"
import { markdownToHtml } from "./markdownToHtml"
import { exportPdf } from "./exportPdf"
import { checkPuppeteerBinary } from "./checkPuppeteerBinary"
import { exportHtml } from "./exportHtml"
import { deleteFile, isExistsPath } from "./util"

type OutputType = 'html' | 'pdf' | 'png' | 'jpeg';
type paperbackWriterOptionType = {
  command: 'settings' | 'all' | OutputType
}

export const paperbackWriter = async ({ command }: paperbackWriterOptionType) => {
  console.group(`paperbackWriter({ command: ${command} })`)

  const typesFormat: OutputType[] = ['html', 'pdf', 'png', 'jpeg']

  try {
    if (!checkPuppeteerBinary()) {
      showMessage({
        message: `Chromium or Chrome does not exist! See https://github.com/yzane/vscode-markdown-pdf#install`,
        type: 'error'
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
    const editorDocumentPath = editorDocumentUri.fsPath
    const ext = path.extname(editorDocumentPath)

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

      let editorDicumentHtml: string | undefined = undefined
      if (editorDocumentLanguageId === 'markdown') {
        editorDicumentHtml = await markdownToHtml(editorText)
      }

      // 一時ファイルを作成
      const tmpfilePath = await createTmpHtmlFile(editorDicumentHtml, editorDocumentPath)
      
      // 出力ごとに処理
      outputTypes.forEach( async (outputType, index) => {
        console.log(`${index + 1}/${outputTypes?.length} (${editorDocumentPath}) : ${editorDocumentLanguageId} -> ${outputType}`)

        if (typesFormat.indexOf(outputType) >= 0) {
          const outputFilename = editorDocumentPath.replace(ext, '.' + outputType)

          if (outputType === 'html' && editorDicumentHtml) {
            await exportHtml(editorDicumentHtml, outputFilename)
            showMessage({
              message: `Exported ${outputFilename}`,
              type: 'info'
            })

          } else {
            switch (editorDocumentLanguageId) {
              case 'markdown':
                if (editorDicumentHtml && tmpfilePath) {
                  await exportPdf({
                    htmlPath: tmpfilePath,
                    outputFilename,
                    outputType,
                    scope: editorDocumentUri,
                    editorDocumentUri
                  })
                  showMessage({
                    message: `Exported ${outputFilename}`,
                    type: 'info'
                  })
                }
                break
            }
          }
        }
      })

      // 一時ファイルを削除
      await deleteTempHtmlFile(tmpfilePath)
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

/**
 * 一時HTMLファイルを作成
 * @param html HTMLのテキスト
 * @param basePath もとのファイルパス
 * @returns 作成された一時ファイルのパス
 */
const createTmpHtmlFile = async (html: string | undefined, basePath: string):Promise<string | undefined> => {
  let tmpfilePath: string | undefined = undefined
  if (html) {
    const f = path.parse(basePath)
    tmpfilePath = path.join(f.dir, f.name + '_tmp.html')
    await exportHtml(html, tmpfilePath)
    console.log('add: ', tmpfilePath)
    return tmpfilePath
  }
  return undefined
}

const deleteTempHtmlFile = async (tmpfilePath: string | undefined): Promise<void> => {
  if (tmpfilePath && await isExistsPath(tmpfilePath)) {
    await deleteFile(tmpfilePath)
    console.log('remove: ', tmpfilePath)
  }
}