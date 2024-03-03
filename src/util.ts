import fs from 'fs'
import path from "path"
import { getNls, getPaperbackWriterConfiguration, getWorkspaceFolder, showMessage } from './vscode-util'
import { mkdirp } from "mkdirp"
import os from "os"
import * as vscode from 'vscode'
import { rimraf } from 'rimraf'

/**
 * ファイルパスの存在を確認する
 */
export const isExistsPath = (path: fs.PathLike) => {
  if (typeof path === "string" && path.length === 0) {
    return false
  }
  try {
    fs.accessSync(path)
    return true
  } catch (error: any) {
    return false
  }
}

/**
 * ディレクトリを作成する
 */
export const mkdir = (path: string) => {
  if (isExistsDir(path)) {
    return
  }
  return mkdirp.sync(path)
}

/**
 * ディレクトリの存在を確認する
 * @param dirname 
 * @returns 
 */
export const isExistsDir = (dirname: fs.PathLike) => {
  if (typeof dirname === "string" && dirname.length === 0) {
    return false
  }
  try {
    if (fs.statSync(dirname).isDirectory()) {
      return true
    } else {
      console.warn('Directory does not exist!')
      return false
    }
  } catch (error: any) {
    console.warn(error.message)
    return false
  }
}

/**
 * ディレクトリを削除する
 */
export const deleteFile = (path: string | string[]) => {
  try {
    console.group(`deleteFile(${path})`)
    rimraf.sync(path)
  } catch (error: any) {
    console.warn(error.message)
  } finally {
    console.groupEnd
  }
}

/** pathName(ファイルのパス)から、出力pathNameを返す */
export const getOutputPathName = (pathName: string, resource: vscode.Uri) => {
  try {
    const pwConf = getPaperbackWriterConfiguration()
    if (resource === undefined) {
      return pathName
    }

    const outputDirectory = pwConf.outputDirectory
    if (outputDirectory.length === 0) {
      return pathName
    }

    if (outputDirectory.indexOf('~') === 0) {
      const outputDir = outputDirectory.replace(/^~/, os.homedir())
      mkdir(outputDir)
      return path.join(outputDir, path.basename(pathName))
    }

    if (path.isAbsolute(outputDirectory)) {
      if (!isExistsDir(outputDirectory)) {
        showMessage({
          message: getNls()["markdown-pdf.outputDirector.notExist"],
          type: 'error'
        })
        return
      }
      return path.join(outputDirectory, path.basename(pathName))
    }

    var outputDirectoryRelativePathFile = pwConf.outputDirectoryRelativePathFile
    let root = getWorkspaceFolder(resource)

    if (outputDirectoryRelativePathFile === false && root) {
      const outputDir = path.join(root.uri.fsPath, outputDirectory)
      mkdir(outputDir)
      return path.join(outputDir, path.basename(pathName))
    }

    const outputDir = path.join(path.dirname(resource.fsPath), outputDirectory)
    mkdir(outputDir)
    return path.join(outputDir, path.basename(pathName))

  } catch (error) {
    showMessage({
      message: `getOutputDir(): ${error}`,
      type: 'error'
    })
  }
}

/** その文字列が拡張子を表す文字列を持っているか */
export const hasExtension = (str: string) => {
  if (!str || str.length === 0) {
    return false
  }
  // ファイル拡張子を判定する正規表現
  const regex = /\.[0-9a-z]+$/i
  // ファイル拡張子が存在する場合、trueを返す
  return regex.test(str)
}

export const readFile = (filename: string, encode?: any) => {
  if (filename.length === 0) {
    return ''
  }
  if (!encode && encode !== null) {
    encode = 'utf-8'
  }
  if (filename.indexOf('file://') === 0) {
    if (process.platform === 'win32') {
      filename = filename.replace(/^file:\/\/\//, '')
                 .replace(/^file:\/\//, '')
    } else {
      filename = filename.replace(/^file:\/\//, '')
    }
  }
  if (isExistsPath(filename)) {
    return fs.readFileSync(filename, { encoding: encode })
  } else {
    return ''
  }
}

