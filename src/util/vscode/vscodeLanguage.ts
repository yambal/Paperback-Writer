import localeEn from "../../../package.nls.json"
import localeJa from "../../../package.nls.ja.json"
import * as vscode from 'vscode'

// ------------------------------
// 言語辞書
type Nls = {
  "extension.paperback-writer.settings": string
  "extension.paperback-writer.pdf": string
  "extension.paperback-writer.png": string
  "extension.paperback-writer.jpeg": string
  "extension.paperback-writer.html": string
  "extension.paperback-writer.all": string
  "paperback-writer.output.auto.dsc": string
  "paperback-writer.output.listOfFileNamesExcludedFromAuto.dsc": string
  "paperback-writer.output.directory.dsc": string
  "paperback-writer.output.directoryRelativePathFile.dsc": string

  "markdown-pdf.outputDirector.notExist": string
  "working...": string
  "Parsing Markdown": string
  "Saving temporary files": string
  "Starting renderer (Puppeteer)": string
  "Rendering": string
  "Outputting": string
  "Deleting temporary files": string
  "Shutting down renderer (Puppeteer)": string
  "Finishing export": string
  "Chromium or Chrome is not found!" : string
  "The editor is not active." : string
  "Markdown file is not active in the editor" : string
  "Support outputting in the formats of HTML, PDF, PNG, and JPEG" : string
}
export const getLang = () => {
  return vscode.env.language
}

export const getNls = ():Nls => {
  const lang = getLang()
  switch (lang) {
    case "ja":
      return localeJa as Nls
    default:
      return localeEn as Nls
  }
}