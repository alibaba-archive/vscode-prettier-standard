const vscode = require('vscode')

function activate (context) {
  console.log(
    'Congratulations, your extension "vscode-prettier-standard" is now active!'
  )

  let prettierDocument = vscode.commands.registerCommand(
    'extension.prettierDocument',
    function () {
    }
  )

  let prettierSelection = vscode.commands.registerCommand(
    'extension.prettierSelection',
    function () {
    }
  )

  context.subscriptions.push(prettierDocument)
  context.subscriptions.push(prettierSelection)
}
exports.activate = activate

function deactivate () {}
exports.deactivate = deactivate
