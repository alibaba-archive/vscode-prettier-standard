/* ---------------------------------------------------------
 * Copyright (C) Teambition Corporation. All rights reserved.
 *-------------------------------------------------------- */

const { commands, window, Selection, Position, StatusBarAlignment } = require('vscode')
const eslintConfigStandard = require('eslint-config-standard')
const prettierESLint = require('prettier-eslint')

function activate(context) {
  console.log(
    'Congratulations, your extension "vscode-prettier-standard" is now active!'
  )
  const controller = new FormatController(commands, window)
  const prettierDocumentCommend = controller.prettierDocument
  const prettierSelectionCommend = controller.prettierSelection
  const button = controller.Button

  context.subscriptions.push(prettierDocumentCommend)
  context.subscriptions.push(prettierSelectionCommend)
  context.subscriptions.push(button)
}

class FormatController {
  constructor(commands, window) {
    this.EXTENSION_NAME = 'Prettier'
    this.PRETTIER_DOCUMENT = 'extension.prettierDocument'
    this.PRETTIER_SELECTION = 'extension.prettierSelection'

    this.window = window
    this.commands = commands
  }

  get prettierDocument() {
    this.commands.registerCommand(
      this.PRETTIER_DOCUMENT,
      () => {
        const activeTextEditor = this.window.activeTextEditor
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

        this._formatAndReplace(selection)
      }
    )
  }

  get prettierSelection() {
    this.commands.registerCommand(
      this.PRETTIER_SELECTION,
      function () {
        const activeTextEditor = this.window.activeTextEditor
        if (!activeTextEditor) {
          return
        }

        const selection = activeTextEditor.selection
        if (!selection) {
          return
        }

        this._formatAndReplace(selection)
      }
    )
  }

  _formatAndReplace(range) {
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

  get Button() {
    const _statusBarItem = this.window.createStatusBarItem(StatusBarAlignment.Right)
    _statusBarItem.text = this.EXTENSION_NAME
    _statusBarItem.command = this.PRETTIER_DOCUMENT
    _statusBarItem.show()
    return _statusBarItem
  }
}

exports.activate = activate
