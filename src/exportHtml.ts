import fs from 'fs'
import { showMessage } from './vscode-util'


export const exportHtml = (data: string | NodeJS.ArrayBufferView, filename: fs.PathOrFileDescriptor) => {
  try {
    console.group(`exportHtml(data, ${filename})`)
    fs.writeFile(filename, data, 'utf-8', (error) => {
      if (error) {
        showMessage({
          message: `exportHtml(): ${error}`,
          type: 'error'
        })
        return
      }
    })
  } catch (error: any) {
  } finally {
    console.groupEnd()
  }
}