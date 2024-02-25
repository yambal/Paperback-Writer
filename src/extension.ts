// モジュール 'vscode' には、VS Code の拡張性 API が含まれています。
// このモジュールをインポートし、以下のコードでvscodeというエイリアスで参照します。
import * as vscode from 'vscode'
import { checkPuppeteerBinary } from './checkPuppeteerBinary'
import { showErrorMessage, showInformationMessage } from './vscode-util'
import { installChromium } from './installChromium'
import { paperbackWriter } from './paperbackWriter'

let INSTALL_CHECK = false

// このメソッドは、拡張機能がアクティブになったときに呼び出されます。
// 拡張機能が有効になるのは、コマンドが最初に実行されたときです。
export function activate(context: vscode.ExtensionContext) {
	init()

	// コンソールを使用して、診断情報 (console.log) とエラー (console.error) を出力します。
	// このコードは、拡張機能が有効化されたときに一度だけ実行されます。
	console.log('Congratulations, your extension "paperback-writer" is now active!')

	// コマンドはpackage.jsonファイルで定義されています。
	// 次に、コマンドの実装を registerCommand で指定します。
	// commandIdパラメータは、package.jsonのcommandフィールドと一致しなければならない。
	var commands = [
		vscode.commands.registerCommand('extension.paperback-writer.settings', async () => { await paperbackWriter('settings') }),
		vscode.commands.registerCommand('extension.paperback-writer.helloWorld', () => {
			vscode.window.showInformationMessage('Hello World from paperback-writer!')
		})
	]

	commands.forEach(command =>{
    context.subscriptions.push(command)
  });
}

// このメソッドは、拡張機能が無効化されたときに呼び出されます。
export function deactivate() {}

const init = async () => {
	console.group('init()')
  try {
    if (checkPuppeteerBinary()) {
			showInformationMessage('checkPuppeteerBinary', 'ok')
      INSTALL_CHECK = true
    } else {
			showInformationMessage('checkPuppeteerBinary', 'install')
      await installChromium()
			INSTALL_CHECK = true
    }
  } catch (error) {
		INSTALL_CHECK = false
    showErrorMessage('init()', error)
  } finally {
		console.groupEnd()
	}	
}


