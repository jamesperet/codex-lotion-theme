<template>
    <div class="row justify-content-center" style="padding-top: 50px;">
        <div class="col-9">
            <div v-html="module_data"></div> 
            <!-- <div id="editor"></div> -->
        </div>
    </div>
</template>

<script>
import {MarkdownEditor} from "./../editor/editor.js"
export default {
    name: "MarkdownView",
    data: function () {
        return {
            module_data: ""
        }
    },
    created: function() {
        console.log("Creating markdown view");
        this.$root.$on('updated-content', this.getContent);
        var vm = this;
        window.addEventListener("popstate", function(event) {
            vm.getContent();
        });
        this.getContent();
    },
    beforeDestroy: function() {
        console.log("Destroying markdown view");
        this.$root.$off('updated-content', this.getContent);
    },
    updated: function() {
        this.getContent();
    },
    methods: {
        getContent: function () {
            var link = window.location.href.replace("#", "") + "?view=content";
            var vm = this;
            axios.get(link).then(response => {
                vm.module_data = response.data.body;
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
                vm.$root.$emit('updated-breadcrumbs');
                vm.$root.$emit('updated-sidebar');
                vm.$root.$emit('updated-links');
                // let place = document.querySelector("#editor");
                // let view = new MarkdownEditor(place, vm.module_data);
            });
        }
    }
}
</script>