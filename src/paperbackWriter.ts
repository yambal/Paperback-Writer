import path from "path"
import { getActiveTextEditor, getEditorDocumentLanguageId, getPaperbackWriterConfiguration, showMessage } from "./vscode-util"
import { markdownToHtml } from "./markdownToHtml"
import { exportPdf } from "./exportPdf"

type OutputType = 'html' | 'pdf' | 'png' | 'jpeg';
type paperbackWriterOptionType = {
  command: 'settings' | 'all' | OutputType
}


export const paperbackWriter = async ({ command }: paperbackWriterOptionType) => {
  console.group(`paperbackWriter({ command: ${command} })`)

  const typesFormat: OutputType[] = ['html', 'pdf', 'png', 'jpeg']

  try {
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
      outputTypes.forEach( async (outputType, index) => {
        console.log(`${index + 1}/${outputTypes?.length} (${mdfilename}) : ${editorDocumentLanguageId} -> ${outputType}`)
        if (typesFormat.indexOf(outputType) >= 0) {
          const outputFilename = mdfilename.replace(ext, '.' + outputType)
          const editorText = editor.document.getText()
          switch (editorDocumentLanguageId) {
            case 'markdown':
              const html = await markdownToHtml(mdfilename, outputType, editorText)
              exportPdf({
                html,
                outputFilename,
                outputType,
                scope: editorDocumentUri,
                editorDocumentUri
              })
              break
          
          }
        }
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