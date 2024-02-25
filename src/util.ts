import fs from 'fs'
import path from "path"
import { getPaperbackWriterConfiguration, getWorkspaceFolder, showMessage } from './vscode-util'
import { mkdirp } from "mkdirp"
import os from "os"
import * as vscode from 'vscode'
import { rimraf } from 'rimraf'
import { group } from 'console'

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
    console.warn(error.message)
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

export const getOutputDir = (filename: string, resource: vscode.Uri) => {
  try {
    const pwConf = getPaperbackWriterConfiguration()
    var outputDir
    if (resource === undefined) {
      return filename
    }
    var outputDirectory = pwConf.outputDirectory
    if (outputDirectory.length === 0) {
      return filename
    }

    if (outputDirectory.indexOf('~') === 0) {
      outputDir = outputDirectory.replace(/^~/, os.homedir())
      mkdir(outputDir)
      return path.join(outputDir, path.basename(filename))
    }

    if (path.isAbsolute(outputDirectory)) {
      if (!isExistsDir(outputDirectory)) {
        showMessage({
          message: 'The output directory specified by the markdown-pdf.outputDirectory option does not exist.',
          type: 'error'
        })
        return
      }
      return path.join(outputDirectory, path.basename(filename))
    }

    var outputDirectoryRelativePathFile = pwConf.outputDirectoryRelativePathFile
    let root = getWorkspaceFolder(resource)

    if (outputDirectoryRelativePathFile === false && root) {
      outputDir = path.join(root.uri.fsPath, outputDirectory)
      mkdir(outputDir)
      return path.join(outputDir, path.basename(filename))
    }

    outputDir = path.join(path.dirname(resource.fsPath), outputDirectory)
    mkdir(outputDir)
    return path.join(outputDir, path.basename(filename))
  } catch (error) {
    showMessage({
      message: `getOutputDir(): ${error}`,
      type: 'error'
    })
  }
}