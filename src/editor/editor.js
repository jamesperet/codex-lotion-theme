import {EditorView} from "prosemirror-view"
import {EditorState} from "prosemirror-state"
import {schema, defaultMarkdownParser,
        defaultMarkdownSerializer} from "prosemirror-markdown"
import {exampleSetup} from "prosemirror-example-setup"

export class ProseMirrorView {
  constructor(target, content, vm) {
    this.vm = vm;
    this.doc = content;
    this.view = this.createEditor(target, content, vm); 
  }

  createEditor(target, content, vm) {
    const editorView = new EditorView(target, {
      state: EditorState.create({
        doc: defaultMarkdownParser.parse(content),
        plugins: exampleSetup({schema: schema, menuBar: false}), 
      }),
      dispatchTransaction (transaction) {
        const newState = editorView.state.apply(transaction);
        editorView.updateState(newState);
        const fragment = defaultMarkdownSerializer.serialize(editorView.state.doc);
        if(this.doc == undefined) this.doc = fragment;
        if(this.doc != fragment){
          console.log("document changed");
          vm.$root.$emit('show-save');
          this.doc = fragment;
        } else {
          console.log("editor updated");
        }
      }
    });
    return editorView;
  }

  get content() {
    return defaultMarkdownSerializer.serialize(this.view.state.doc)
  }

  saveDocument() {
    var link = window.location.href.replace("#", "");
    console.log("Saving document (" + link + ")");
    var vm = this.vm;
    axios.post(link, { file: this.content }).then(response => {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    })
    .then(function () {
      vm.$root.$emit('hide-save');
    });
  }

  focus() { this.view.focus() }

  destroy() { 
    this.vm.$off('save-document', this.save);
    this.view.destroy() 
  }
  
}