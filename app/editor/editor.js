import {EditorView} from "prosemirror-view"
import {EditorState} from "prosemirror-state"
import {schema, defaultMarkdownParser,
        defaultMarkdownSerializer} from "prosemirror-markdown"
import {exampleSetup} from "prosemirror-example-setup"

export class MarkdownEditor {
    constructor(target, content) {
      this.textarea = target.appendChild(document.createElement("textarea"))
      this.textarea.value = content
    }
  
    get content() { return this.textarea.value }
    focus() { this.textarea.focus() }
    destroy() { this.textarea.remove() }
  }

export class ProseMirrorView {
  constructor(target, content) {
    this.view = new EditorView(target, {
      state: EditorState.create({
        doc: defaultMarkdownParser.parse(content),
        plugins: exampleSetup({schema})
      })
    })
  }

  get content() {
    return defaultMarkdownSerializer.serialize(this.view.state.doc)
  }
  focus() { this.view.focus() }
  destroy() { this.view.destroy() }
}