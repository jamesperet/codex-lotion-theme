<template>
    <div class="row justify-content-center" style="padding-top: 50px; height: 100%;">
        <div class="col-12" v-show="show_editor" style="padding-left: 0px; padding-right: 0px; height: 100%;">
            <codemirror
                ref="cmEditor"
                :value="content"
                :options="cmOptions"
                @ready="onCmReady"
                @focus="onCmFocus"
                @input="onCmCodeChange"
                style="height: 100%;"
            />
        </div>
        <div class="col-10" v-show="!show_editor">
            <div v-html="html_content"></div>
        </div>
    </div>
</template>

<script>

import * as cheerio from 'cheerio';
import showdown from 'showdown';
//import CodeMirror from 'codemirror';
import { codemirror } from 'vue-codemirror'
// import base style
import 'codemirror/lib/codemirror.css'
import hljs from 'highlight.js';
export default {
    name: "CodeMirrorEditor",
    components: {
        codemirror
    },
    data: function () {
        return {
            show_editor: true,
            content: "",
            html_content: "",
            editor: undefined,
            old_content : "",
            cmOptions: {
                tabSize: 4,
                mode: 'text/javascript',
                theme: 'tomorrow-night',
                lineNumbers: true,
                line: true,
                viewportMargin: Infinity,
                fixedGutter: false,
                lineWrapping: true
                // more CodeMirror options...
            }
        }
    },
    created: function() {
        console.log('%cLoading ' + '%cCodeMirror' + '%c editor', '', 'font-weight: 800', '');
        this.$root.$on('view-document', this.viewDocument);
        this.$root.$on('edit-document', this.editDocument);
    },
    beforeDestroy: function() {
        this.editor.destroy()
    },
    updated: function() {

    },
    methods: {
        convertHtmlToMarkdown: function(html_content){
            var markdown_content = new showdown.Converter().makeMarkdown(html_content);
            return markdown_content;
        },
        convertMarkdownToHtml: function(markdown_content){
            var html_content = new showdown.Converter().makeHtml(markdown_content);
            return html_content;
        },
        setEditor: function(markdown_content){
            this.content = markdown_content;
            this.old_content = markdown_content;
            this.html_content = this.convertMarkdownToHtml(markdown_content);
            this.$nextTick (() => { 
                this.show_editor = false; 
                this.$nextTick (() => { 
                    document.querySelectorAll('pre code').forEach((el) => {
                        hljs.highlightElement(el);
                    });
                });
            });
            this.$root.$emit('hide-save');
            this.$root.$emit('show-edit');
            this.$root.$emit('hide-view');
            
        },
        viewDocument: function() {
            this.html_content = this.convertMarkdownToHtml(this.content);
            this.show_editor = false;
            this.$root.$emit('hide-view');
            this.$root.$emit('show-edit');
            this.$nextTick (() => { 
                document.querySelectorAll('pre code').forEach((el) => {
                    hljs.highlightElement(el);
                });
            });
        },
        editDocument: function() {
            this.show_editor = true;
            //var textarea = this.$refs.cmEditor.$el.getElementsByTagName("TEXTAREA")[0];
            //console.log(textarea);
            //textarea.focus();
            this.$nextTick (() => { this.editor.focus(); });
            this.$root.$emit('show-view');
            this.$root.$emit('hide-edit');
        },
        onCmReady(cm) {
            console.log('the editor is readied!', cm);
            this.editor = cm;
            this.$nextTick (() => { this.editor.focus(); });
        },
        onCmFocus(cm) {
            console.log('the editor is focused!', cm)
        },
        onCmCodeChange(newCode) {
            if(this.old_content != newCode){
                // content changed
                this.old_content = newCode;
                console.log("CodeMirror editor updated");
                this.$root.$emit('show-save');
            }
            this.content = newCode
        },
        clearEditor: function(){
            this.old_content = "";
            return this.content = "";
        },
        getEditorDocument: function(){
            return this.content;
        },
    },
    computed: {
        codemirror() {
            return this.$refs.cmEditor.codemirror
        }
    },
    mounted() {
        console.log('the current CodeMirror instance object:', this.codemirror)
        // you can use this.codemirror to do something...
    }
}
</script>

<style>

</style>