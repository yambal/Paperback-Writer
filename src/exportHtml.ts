import fs from 'fs'
import { showMessage } from './vscode-util'


export const exportHtml = async (data: string | NodeJS.ArrayBufferView, filename: fs.PathOrFileDescriptor):Promise<void> => {
  try {
    console.log(`exportHtml(data, ${filename})`)
    await fs.writeFile(filename, data, 'utf-8', (error) => {
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
  }
}