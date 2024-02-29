import fs from 'fs'

export type ExportHtmlProps = {
  htmlString: string | NodeJS.ArrayBufferView
  exportPath: fs.PathOrFileDescriptor
}

export const exportHtml = ({htmlString, exportPath}: ExportHtmlProps):Promise<string> => {
  return new Promise((resolve, reject) => { 
    try {
      fs.writeFile(exportPath, htmlString, 'utf-8', (error) => {
        if (error) {
          reject(error.message)
        } else {
          resolve(exportPath.toString())
        }
      })
    } catch (error: any) {
      reject(`error@exportHtml(): ${error}`)
    }
  })
}