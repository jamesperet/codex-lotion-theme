<template>
  <div class="row justify-content-center" style="padding-top: 50px;">
    <div class="col-9">
      <div id="editor"></div>        
    </div>
  </div>
</template>

<script>
import {EditorView} from "prosemirror-view"
import {EditorState} from "prosemirror-state"
import {schema, defaultMarkdownParser,
        defaultMarkdownSerializer} from "prosemirror-markdown"
import {exampleSetup} from "prosemirror-example-setup"

class ProseMirrorView {
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



  focus() { this.view.focus() }

  destroy() { 
    this.vm.$off('save-document', this.save);
    this.view.destroy() 
  }
  
}

export default {
    name: "ProsemirrorEditor",
    data: function () {
        return {
            content: "",
            prosemirror_editor_view : undefined,
            editor_container : undefined
        }
    },
    created: function() {
        console.log('%cLoading ' + '%cProsemirror' + '%c editor', '', 'font-weight: 800', '');
    },
    beforeDestroy: function() {
        
    },
    updated: function() {
        
    },
    methods: {
        setEditor: function(content){
            this.content = content;
            this.editor_container = document.querySelector("#editor");
            this.clearEditor();
            this.prosemirror_editor_view = new ProseMirrorView(this.editor_container, this.content, this);
        },
        clearEditor: function(){
            if(this.editor_container != undefined) this.editor_container.innerHTML = "";
        },
        getEditorDocument: function(){
            return this.prosemirror_editor_view.content;
        }
    }
}
</script>