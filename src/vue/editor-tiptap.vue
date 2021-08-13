<template>
    <div id="TiptapEditor">
        <editor-content :editor="editor" id="editor"></editor-content>
    </div>
</template>

<script>
import { Editor, EditorContent, VueNodeViewRenderer } from '@tiptap/vue-2';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Code from '@tiptap/extension-code'
import * as cheerio from 'cheerio';
import showdown from 'showdown';

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import CodeBlockComponent from './code-block.vue'
import lowlight from 'lowlight'

export default {
    name: "TipTapEditor",
    components: {
        EditorContent : EditorContent,
    },
    data: function () {
        return {
            editor: undefined,
            old_content : ""
        }
    },
    created: function() {
        console.log('%cLoading ' + '%cTiptap' + '%c editor', '', 'font-weight: 800', '');
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
            var vm = this;
            var html_content = vm.convertMarkdownToHtml(markdown_content);
            //var formated_content = vm.applySyntaxHighlight(html_content);
            this.editor = new Editor({
                content: html_content,
                extensions: [
                    StarterKit, Document, Paragraph, Text, Code, Highlight, Typography, Underline,
                    CodeBlockLowlight
                    .extend({
                        addNodeView() {
                            return VueNodeViewRenderer(CodeBlockComponent)
                        },
                    })
                    .configure({ lowlight }),
                ],
                onUpdate() {
                    const json = this.getJSON()
                    var current_content = vm.convertHtmlToMarkdown(this.getHTML());
                    if(vm.old_content != current_content){
                        console.log("tiptap editor updated");
                        vm.$root.$emit('show-save');
                    }
                },
            })
            
        },
        clearEditor: function(){
            if(this.editor != undefined) this.editor.commands.setContent("");
            var elem = document.getElementById("editor");
            while (elem.hasChildNodes()) {  
                elem.removeChild(elem.firstChild);
            }
            this.editor = undefined;
        },
        getEditorDocument: function(){
            return this.convertHtmlToMarkdown(this.editor.getHTML())
        },
        applySyntaxHighlight: function(html_content){
            var vm = this;
            const $ = cheerio.load(html_content);
            console.log();
            $('pre').replaceWith(function(){
                var code_element = $(this).children().first();
                var classes = code_element.attr('class');
                console.log(classes);
                var lang = { language: classes.split(' ')[0] }
                var highlighted_code = vm.$root.hljs.highlight(code_element.html(), lang).value;
                console.log(code_element.html());
                console.log(highlighted_code);
                return `<pre><code class="${classes}">${highlighted_code}</code></pre>`;
                //vm.$root.hljs.highlightAuto($(this).html()).value;
                //return vm.$root.hljs.highlight($(this).html(), { language: classes }).value;
            })
            console.log($.html());
            return $.html();
        }
    }
}
</script>