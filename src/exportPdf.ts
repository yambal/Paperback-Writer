import { checkPuppeteerBinary } from "./checkPuppeteerBinary"
import { 
  getPaperbackWriterConfiguration, showMessage,
} from "./vscode-util"
import { deleteFile, getOutputDir, isExistsPath } from "./util"
import * as vscode from 'vscode'
import { exportHtml } from "./exportHtml"
import path from "path"

export type exportPdfProps = {
  html: string,
  outputFilename: string,
  outputType: string,
  scope: vscode.ConfigurationScope | null | undefined
  editorDocumentUri: vscode.Uri
}

export const exportPdf = ({
  html,
  outputFilename,
  outputType,
  scope,
  editorDocumentUri
}: exportPdfProps) => {

  const pwConf = getPaperbackWriterConfiguration()
  const pwWsConf = getPaperbackWriterConfiguration(scope)
  
  if (!checkPuppeteerBinary()) {
    showMessage({
      message: `Chromium or Chrome does not exist! See https://github.com/yzane/vscode-markdown-pdf#install`,
      type: 'error'
    })
    return
  }

  var StatusbarMessageTimeout = pwConf.StatusbarMessageTimeout
  var exportFilename = getOutputDir(outputFilename, editorDocumentUri)
  if (!exportFilename) {
    return
  }
  
  return vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: '[Markdown PDF]: Exporting (' + outputType + ') ...'
    }, async () => {
      try {
        // export html
        if (outputType === 'html' && exportFilename) {
          exportHtml(html, exportFilename)
          // vscode.window.setStatusBarMessage('$(markdown) ' + exportFilename, StatusbarMessageTimeout);
          return
        }

        const puppeteer = require('puppeteer-core')
        // create temporary file
        var f = path.parse(outputFilename)
        var tmpfilename = path.join(f.dir, f.name + '_tmp.html')
        exportHtml(html, tmpfilename)

        /** Papeteer 起動 */
        const browser = await puppeteer.launch({
          executablePath: pwConf.executablePath || puppeteer.executablePath(),
          args: ['--lang='+vscode.env.language, '--no-sandbox', '--disable-setuid-sandbox']
        })
        const page = await browser.newPage()
        await page.setDefaultTimeout(0)
        /** 一時HTMLを開く */
        await page.goto(vscode.Uri.file(tmpfilename).toString(), { waitUntil: 'networkidle0' })

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
          await page.pdf(options)
        }

        if (outputType === 'png' || outputType === 'jpeg') {
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
          await page.screenshot(options)
        }

        await browser.close()

        if (isExistsPath(tmpfilename)) {
          deleteFile(tmpfilename)
        }

        vscode.window.setStatusBarMessage('$(markdown) ' + exportFilename, StatusbarMessageTimeout)
      } catch (error) {
        showMessage({
          message: `exportPdf(): ${error}`,
          type: 'error'
        })
      }
    }
  )
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