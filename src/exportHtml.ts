import fs from 'fs'

export const exportHtml = (data: string | NodeJS.ArrayBufferView, path: fs.PathOrFileDescriptor):Promise<string> => {
  return new Promise((resolve, reject) => { 
    try {
      fs.writeFile(path, data, 'utf-8', (error) => {
        if (error) {
          reject(error.message)
        } else {
          resolve(path.toString())
        }
      })
    } catch (error: any) {
      reject(`error@exportHtml(): ${error}`)
    }
  })
}