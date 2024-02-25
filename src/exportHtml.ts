import fs from 'fs'
import { showErrorMessage } from './vscode-util'


export const exportHtml = (data: string | NodeJS.ArrayBufferView, filename: fs.PathOrFileDescriptor) => {
  fs.writeFile(filename, data, 'utf-8', (error) => {
    if (error) {
      showErrorMessage('exportHtml()', error)
      return;
    }
  });
}