// モジュール 'vscode' には、VS Code の拡張性 API が含まれています。
// このモジュールをインポートし、以下のコードでvscodeというエイリアスで参照します。
import * as vscode from 'vscode'
import { checkPuppeteerBinary } from './checkPuppeteerBinary'
import { showMessage } from './vscode-util'
import { installChromium } from './installChromium'
import { paperbackWriter } from './paperbackWriter'

let INSTALL_CHECK = false

// このメソッドは、拡張機能がアクティブになったときに呼び出されます。
// 拡張機能が有効になるのは、コマンドが最初に実行されたときです。
export function activate(context: vscode.ExtensionContext) {
	checkPuppeteer()

	// コンソールを使用して、診断情報 (console.log) とエラー (console.error) を出力します。
	// このコードは、拡張機能が有効化されたときに一度だけ実行されます。
	showMessage({
		message: 'Congratulations, your extension "paperback-writer" is now active!',
		type: 'info'
	})

	// コマンドはpackage.jsonファイルで定義されています。
	// 次に、コマンドの実装を registerCommand で指定します。
	// commandIdパラメータは、package.jsonのcommandフィールドと一致しなければならない。
	var commands = [
		vscode.commands.registerCommand('extension.paperback-writer.settings', async () => {
			await paperbackWriter({command: 'settings'})
		}),
		vscode.commands.registerCommand('extension.paperback-writer.pdf', async () => {
			await paperbackWriter({command: 'pdf'})
		}),
		vscode.commands.registerCommand('extension.paperback-writer.all', async () => {
			await paperbackWriter({command: 'all'})
		}),
		vscode.commands.registerCommand('extension.paperback-writer.helloWorld', () => {
			vscode.window.showInformationMessage('Hello World from paperback-writer!')
		})
	]

	commands.forEach(command =>{
    context.subscriptions.push(command)
  })
}

// このメソッドは、拡張機能が無効化されたときに呼び出されます。
export function deactivate() {}

const checkPuppeteer = async () => {
	console.group('checkPuppeteer()')
  try {
    if (checkPuppeteerBinary()) {
      INSTALL_CHECK = true
    } else {
      await installChromium()
			INSTALL_CHECK = true
    }
  } catch (error) {
		INSTALL_CHECK = false
		showMessage({
			message: `checkPuppeteer(): ${error}`,
			type: 'error'
		})
  } finally {
		console.groupEnd()
	}	
}