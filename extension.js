const { commands, window, Selection, Position } = require('vscode')
const eslintConfigStandard = require('eslint-config-standard')
const prettierESLint = require('prettier-eslint')

function formatAndReplace (range) {
  const activeTextEditor = window.activeTextEditor
  const text = activeTextEditor.document.getText(range)
  try {
    const formatted = prettierESLint({
      text: text,
      eslintConfig: eslintConfigStandard
    })
    activeTextEditor
      .edit(editor => {
        editor.replace(range, formatted)
      })
      .then(
        () => {
          window.showInformationMessage('format success!')
        },
        err => {
          window.showErrorMessage(err.message)
        }
      )
  } catch (err) {
    window.showErrorMessage(err.message)
  }
}

function activate (context) {
  console.log(
    'Congratulations, your extension "vscode-prettier-standard" is now active!'
  )

  let prettierDocument = commands.registerCommand(
    'extension.prettierDocument',
    function () {
      const activeTextEditor = window.activeTextEditor
      if (!activeTextEditor) {
        return
      }

      const document = activeTextEditor.document
      const lineCount = document.lineCount
      if (lineCount < 1) {
        return
      }

      const start = new Position(0, 0)
      const lastLine = document.lineAt(document.lineCount - 1)
      const end = new Position(
        activeTextEditor.document.lineCount,
        lastLine.text.length
      )
      const selection = new Selection(start, end)

      formatAndReplace(selection)
    }
  )

  let prettierSelection = commands.registerCommand(
    'extension.prettierSelection',
    function () {
      const activeTextEditor = window.activeTextEditor
      if (!activeTextEditor) {
        return
      }

      const selection = activeTextEditor.selection
      if (!selection) {
        return
      }

      formatAndReplace(selection)
    }
  )

  context.subscriptions.push(prettierDocument)
  context.subscriptions.push(prettierSelection)
}
exports.activate = activate

function deactivate () {}
exports.deactivate = deactivate
