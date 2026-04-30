import { Compartment, EditorState } from "@codemirror/state"
import { EditorView, keymap } from "@codemirror/view"
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete"
import { oneDark } from "@codemirror/theme-one-dark"
import { css } from "@codemirror/lang-css"
import { html } from "@codemirror/lang-html"
import { javascript } from "@codemirror/lang-javascript"

const langMap = { css, html, javascript }

export type LangKey = keyof typeof langMap

export function createEditor(
    container: HTMLElement,
    { onChange, getType }: { onChange: () => void; getType: () => LangKey },
) {
  const language = new Compartment()
  let settingValue = false

  const view = new EditorView({
    parent: container,
    state: EditorState.create({
      extensions: [
        oneDark,
        history(),
        closeBrackets(),
        autocompletion(),
        keymap.of([...defaultKeymap, ...closeBracketsKeymap, ...completionKeymap, ...historyKeymap]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !settingValue) {
            onChange()
          }
        }),
        language.of(langMap[getType()]()),
      ],
    }),
  })

  return {
    getValue: () => view.state.doc.toString(),
    setValue: (value: string) => {
      settingValue = true
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      })
      settingValue = false
    },
    setLanguage: (type: LangKey) => view.dispatch({
      effects: language.reconfigure(langMap[type]()),
    }),
    destroy: () => view.destroy(),
  }
}
