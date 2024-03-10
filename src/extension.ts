// モジュール 'vscode' には、VS Code の拡張性 API が含まれています。
// このモジュールをインポートし、以下のコードでvscodeというエイリアスで参照します。
import * as vscode from 'vscode'
import { checkPuppeteerBinary } from './checkPuppeteerBinary'
import { getPaperbackWriterConfiguration, showMessage } from './vscode-util'
import { installChromium } from './installChromium'
import { paperbackWriter, autoSave } from './paperbackWriter'

// このメソッドは、拡張機能がアクティブになったときに呼び出されます。
// 拡張機能が有効になるのは、コマンドが最初に実行されたときです。
export const activate = async (context: vscode.ExtensionContext) => {
	checkPuppeteer()
	.then(() => {
		showMessage({
			message: 'Congratulations, your extension "paperback-writer" is now active!',
			type: 'info'
		})
	}).catch((error) => {
		showMessage({
			message: error.message,
			type: 'error'
		})
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
		vscode.commands.registerCommand('extension.paperback-writer.png', async () => {
			await paperbackWriter({command: 'png'})
		}),
		vscode.commands.registerCommand('extension.paperback-writer.jpeg', async () => {
			await paperbackWriter({command: 'jpeg'})
		}),
		vscode.commands.registerCommand('extension.paperback-writer.html', async () => {
			await paperbackWriter({command: 'html'})
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

	/** 自動保存 */
	const PwCnf = getPaperbackWriterConfiguration()
	if (PwCnf.output.auto) {
		var disposable_onsave = vscode.workspace.onDidSaveTextDocument(() => { 
			autoSave()
		})
    context.subscriptions.push(disposable_onsave)
	}
}

// このメソッドは、拡張機能が無効化されたときに呼び出されます。
export function deactivate() {}

const checkPuppeteer = ():Promise<void> => {
	return new Promise((resolve, reject) => {
		try {
			const PwCnf = getPaperbackWriterConfiguration()
			if (checkPuppeteerBinary({pathToAnExternalChromium: PwCnf.pathToAnExternalChromium})) {
				resolve()
			} else {
				return installChromium({pathToAnExternalChromium: PwCnf.pathToAnExternalChromium})
				.then(() => {
					resolve()
				})
			}
		} catch (error) {
			reject(error)
		}
	})
}

