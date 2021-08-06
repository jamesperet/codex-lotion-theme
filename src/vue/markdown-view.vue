<template>
    <div class="row justify-content-center" style="padding-top: 50px;">
        <div class="col-9">
            <!-- <div v-html="module_data"></div>  -->
            <div id="editor"></div>
        </div>
    </div>
</template>

<script>
import {MarkdownEditor, ProseMirrorView} from "./../editor/editor.js"
export default {
    name: "MarkdownView",
    data: function () {
        return {
            module_data: "",
            editor_view : undefined,
            editor_container : undefined
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
                vm.module_data = response.data;
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
                vm.editor_container = document.querySelector("#editor");
                vm.clearEditor();
                //vm.editor_view = new MarkdownEditor(place, vm.module_data);
                vm.editor_view = new ProseMirrorView(vm.editor_container, vm.module_data, vm);
            });
        },
        clearEditor: function(){
            if(this.editor_container != undefined) this.editor_container.innerHTML = "";
        },
        saveDocument: function(){
            //console.log("saving document...");
            if(this.editor_view != undefined) this.editor_view.saveDocument();
        }
    }
}
</script>