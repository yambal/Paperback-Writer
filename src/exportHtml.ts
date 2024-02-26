import fs from 'fs'
import { showMessage } from './vscode-util'

export const exportHtml = (data: string | NodeJS.ArrayBufferView, filename: fs.PathOrFileDescriptor):Promise<void> => {
  return new Promise((resolve, reject) => { 
    try {
      console.log(`exportHtml(data, ${filename})`)
      fs.writeFile(filename, data, 'utf-8', (error) => {
        if (error) {
          showMessage({
            message: `exportHtml(): ${error}`,
            type: 'error'
          })
          reject(error)
        } else {
          resolve()
        }
      })
    } catch (error: any) {
      reject()
    } finally {
    }
  })
}