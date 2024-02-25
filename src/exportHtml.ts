import fs from 'fs'
import { showMessage } from './vscode-util'


export const exportHtml = (data: string | NodeJS.ArrayBufferView, filename: fs.PathOrFileDescriptor) => {
  fs.writeFile(filename, data, 'utf-8', (error) => {
    if (error) {
      showMessage({
        message: `exportHtml(): ${error}`,
        type: 'error'
      })
      return
    }
  })
}