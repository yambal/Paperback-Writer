import path from "path";
import { getActiveTextEditor, getLanguageId, getPaperbackWriterConfiguration, showWarningMessage } from "./vscode-util";
import { markdownToHtml } from "./markdownToHtml";
import { exportPdf } from "./exportPdf";


type paperbackWriterOptionType = 'settings' | 'helloWorld';

type OutputType = 'html' | 'pdf' | 'png' | 'jpeg';

export const paperbackWriter = async (paperbackWriterOption: paperbackWriterOptionType) => {
  let outputTypes: OutputType[] | undefined = undefined
  const types_format: OutputType[] = ['html', 'pdf', 'png', 'jpeg'];

  try {
    var editor = getActiveTextEditor();
    if (!editor) {
      showWarningMessage('Ops', 'No active Editor!')
      return;
    }

    var editorDocumentUri = editor.document.uri;
    var mdfilename = editorDocumentUri.fsPath
    var ext = path.extname(mdfilename)

    var languageId = getLanguageId()
    if (languageId !== 'markdown' && languageId !== 'html') {
      showWarningMessage('Ops', 'It is not a markdown mode!');
      return;
    }

    switch (paperbackWriterOption) {
      case 'settings':
        outputTypes = paperbackWriterSetting() || ['pdf']
        break;

      case 'helloWorld':
        console.log('helloWorld')
        break;
      default:
        console.log('default')
    }

    if (outputTypes && outputTypes.length > 0) {
      for (var i = 0; i < outputTypes.length; i++) {
        const outputType = outputTypes[i]

        if (types_format.indexOf(outputType) >= 0) {
          const outputFilename = mdfilename.replace(ext, '.' + outputType)
          const text = editor.document.getText()

          if (languageId === 'markdown') {
            console.log(mdfilename, outputType, text)
            const html = await markdownToHtml(mdfilename, outputType, text)
            exportPdf({
              html,
              outputFilename,
              outputType,
              scope: editorDocumentUri,
              editorDocumentUri
            })
          }
        }
      }
    }

  } catch (error) {
    console.error('paperbackWriter()', error);
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