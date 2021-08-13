<template>
    <div class="row justify-content-center" style="padding-top: 50px;">
        <div class="col-9">
            <!-- <div v-html="module_data"></div>  -->
            <editor-tip-tap ref="editor"></editor-tip-tap>
            <!-- <editor-prosemirror ref="editor"></editor-prosemirror> -->
        </div>
    </div>
</template>

<script>
//import editorProsemirror from "./editor-prosemirror.vue";
import editorTipTap from "./editor-tiptap.vue";
export default {
    name: "MarkdownView",
    components: { 
        //EditorProsemirror : editorProsemirror,
        EditorTipTap : editorTipTap ,
    },
    data: function () {
        return {
            content: "",
        }
    },
    created: function() {
        console.log("Creating markdown view");
        this.$root.$on('updated-content', this.getContent);
        this.$root.$on('save-document', this.saveDocument);
        var vm = this;
        window.addEventListener("popstate", function(event) {
            vm.getContent();
        });
        this.getContent();
    },
    beforeDestroy: function() {
        console.log("Destroying markdown view");
        this.$root.$off('updated-content', this.getContent);
        this.$root.$off('save-document', this.saveDocument);
    },
    updated: function() {
        this.getContent();
    },
    methods: {
        getContent: function () {
            var link = window.location.href.replace("#", "") + "?view=raw";
            var vm = this;
            axios.get(link).then(response => {
                vm.content = response.data;
                vm.$store.commit("setErrorState", false);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                vm.$store.commit("setErrorState", true);
            })
            .then(function () {
                // always executed
                vm.$root.$emit('updated-breadcrumbs');
                vm.$root.$emit('updated-sidebar');
                vm.$root.$emit('updated-links');
                vm.$root.$emit('hide-save');
                if(window.location.href.split('.').pop() == "md"){
                    vm.$store.commit("setLocation", window.location.href);
                    console.log("markdown view location: " +  vm.$store.getters.getLocation());
                }
                vm.$refs.editor.clearEditor();
                vm.$refs.editor.setEditor(vm.content);
            });
        },
        saveDocument: function(){
            var vm = this;
            vm.content = vm.$refs.editor.getEditorDocument();
            var link = window.location.href.replace("#", "");
            var file_path = link.replace(window.location.protocol, '').replace(window.location.host, '')
                .replace("///", "").replace("//", "");
            console.log("Saving document (" + file_path + ")");
            var data = vm.content;
            data = data.replaceAll("\\", "");
            console.log(data);
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
    }
}
</script>