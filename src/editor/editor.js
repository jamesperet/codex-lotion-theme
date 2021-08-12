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
    return defaultMarkdownSerializer.serialize(this.view.state.doc,)
  }

  saveDocument() {
    var link = window.location.href.replace("#", "");
    var file_path = link.replace(window.location.protocol, '').replace(window.location.host, '')
      .replace("///", "").replace("//", "");
    console.log("Saving document (" + file_path + ")");
    var data = this.content;
    data = data.replaceAll("\\", "");
    console.log(data);
    var vm = this.vm;
    var id = file_path.replaceAll("/", "-").replaceAll(".", "-");
    var msg = { id : id, text: `Saving \'${file_path}\'`, status: 'incomplete'}
    vm.$store.commit("setActivityMessage", msg);
    vm.$root.$emit('hide-save');
    axios.post(link, { file: data }).then(response => {
        console.log(response);
        var success_msg = { id : id, text: `Saved \'${file_path}\'`, status: 'success'}
        vm.$store.commit("setActivityMessage", success_msg);
        vm.$root.$emit('updated-content');
    })
    .catch(function (error) {
        console.log(error);
        var error_msg = { id : id, text: `Error saving \'${file_path}\'`, status: 'error'}
        vm.$store.commit("setActivityMessage", error_msg);
        vm.$root.$emit('show-save');
    })
    .then(function () {
      
    });
  }

  focus() { this.view.focus() }

  destroy() { 
    this.vm.$off('save-document', this.save);
    this.view.destroy() 
  }
  
}