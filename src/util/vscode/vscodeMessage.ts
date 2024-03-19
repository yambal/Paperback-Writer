import * as vscode from 'vscode'

// ------------------------------

/**
 * メッセージの種類
 */
export type MessageType = "error" | "warning" | "info" | "log"

/**
 * メッセージを表示する
 */
export type ShowMessageProps = {
  /** 表示メッセージ */
  message: string,
  /** メッセージの種類 */
  type: MessageType
}
export const showMessage = ({
  message,
  type
}: ShowMessageProps) => {

  switch (type) {
    case "error":
      vscode.window.showErrorMessage(message)
      break
    case "warning":
      vscode.window.showWarningMessage(message)
      break
    case "info":
      vscode.window.showInformationMessage(message)
      break
    case "log":
      console.log(message)
      break
    default:
      vscode.window.showInformationMessage(message)
      break
  }
}