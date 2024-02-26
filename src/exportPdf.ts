import { 
  getPaperbackWriterConfiguration, showMessage,
} from "./vscode-util"
import { deleteFile, getOutputDir, isExistsPath } from "./util"
import * as vscode from 'vscode'
import { exportHtml } from "./exportHtml"
import path from "path"
import { lunchPuppeteer } from "./lunchPuppeteer"

export type exportPdfProps = {
  html: string,
  outputFilename: string,
  outputType: string,
  scope: vscode.ConfigurationScope | null | undefined
  editorDocumentUri: vscode.Uri
}

export const exportPdf = async ({
  html,
  outputFilename,
  outputType,
  scope,
  editorDocumentUri
}: exportPdfProps): Promise<void> => {

  return new Promise((resolve, reject) => {
    const pwConf = getPaperbackWriterConfiguration()
    const pwWsConf = getPaperbackWriterConfiguration(scope)

    // var StatusbarMessageTimeout = pwConf.StatusbarMessageTimeout
    var exportFilename = getOutputDir(outputFilename, editorDocumentUri)
    if (!exportFilename) {
      return
    }

    if (outputType === 'html' && exportFilename) {
      return exportHtml(html, exportFilename)
      .then(() => {
        resolve()
      })
      .catch((error) => {
        showMessage({
          message: `exportPdf(): ${error}`,
          type: 'error'
        })
        reject()
      }).finally(() => {

      })
    }

    // create temporary file
    var f = path.parse(outputFilename)
    var tmpfilename = path.join(f.dir, f.name + '_tmp.html')
    return exportHtml(html, tmpfilename)
    .then(() => {
      return lunchPuppeteer(pwConf.executablePath, vscode.env.language)
      .then(({browser, page}) => {
        return page.goto(vscode.Uri.file(tmpfilename).toString(), { waitUntil: 'networkidle0' })
        .then(() => {
          if (outputType === 'pdf') {
            const options = {
              path: exportFilename,
              scale: pwWsConf.scale,
              displayHeaderFooter: pwWsConf.displayHeaderFooter,
              headerTemplate: transformTemplate(pwWsConf.headerTemplate),
              footerTemplate: transformTemplate(pwWsConf.footerTemplate),
              printBackground: pwWsConf.printBackground,
              landscape: pwWsConf.orientation === 'landscape',
              pageRanges: pwWsConf.pageRanges || '',
              format: !pwWsConf.width && !pwWsConf.height ? pwWsConf.format ?? 'A4' : '',
              width: pwWsConf.width || '',
              height: pwWsConf.height || '',
              margin: {
                top: pwWsConf.margin.top || '',
                right: pwWsConf.margin.right || '',
                bottom: pwWsConf.margin.bottom || '',
                left: pwWsConf.margin.left || ''
              },
              timeout: 0
            }
  
            /** PDF化 */
            return page.pdf(options)
            .then(() => {
              resolve()
            })
            .catch((error: any) => {
              showMessage({
                message: `exportPdf(): ${error}`,
                type: 'error'
              })
              reject()
            })
            .finally(() => {
              if (isExistsPath(tmpfilename)) {
                deleteFile(tmpfilename)
              }
              browser.close()
            })
          } else if (outputType === 'png' || outputType === 'jpeg') {
            const quality_option = outputType === 'png' ? undefined : pwWsConf.quality || 100

            // screenshot size
            const clip_x_option = pwConf.clip.x || null
            const clip_y_option = pwConf.clip.y || null
            const clip_width_option = pwConf.clip.width || null
            const clip_height_option = pwConf.clip.height || null
            let options
            if (clip_x_option !== null && clip_y_option !== null && clip_width_option !== null && clip_height_option !== null) {
              options = {
                path: exportFilename,
                quality: quality_option,
                fullPage: false,
                clip: {
                  x: clip_x_option,
                  y: clip_y_option,
                  width: clip_width_option,
                  height: clip_height_option,
                },
                omitBackground: pwConf.omitBackground,
              }
            } else {
              options = {
                path: exportFilename,
                quality: quality_option,
                fullPage: true,
                omitBackground: pwConf.omitBackground,
              }
            }
            return page.screenshot(options)
            .then(() => {
              resolve()
            })
            .catch((error: any) => {
              showMessage({
                message: `exportPdf(): ${error}`,
                type: 'error'
              })
              reject()
            })
          }
        })
        .catch((error: any) => {
          showMessage({
            message: `exportPdf(): ${error}`,
            type: 'error'
          })
          reject()
        }).finally(() => {
        })
      })
    })
  })
}

export const transformTemplate = (templateText: string) => {
  if (templateText.indexOf('%%ISO-DATETIME%%') !== -1) {
    templateText = templateText.replace('%%ISO-DATETIME%%', new Date().toISOString().substr(0, 19).replace('T', ' '))
  }
  if (templateText.indexOf('%%ISO-DATE%%') !== -1) {
    templateText = templateText.replace('%%ISO-DATE%%', new Date().toISOString().substr(0, 10))
  }
  if (templateText.indexOf('%%ISO-TIME%%') !== -1) {
    templateText = templateText.replace('%%ISO-TIME%%', new Date().toISOString().substr(11, 8))
  }

  return templateText
}