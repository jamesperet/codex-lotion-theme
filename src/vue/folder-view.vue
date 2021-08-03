<template>
    <div class="row justify-content-center" style="padding-top: 50px;">
        <div class="col-12">
            <div class="container">
                <div class="row">
                    <div class=" file text-truncate" v-for="(file, index) in folder_content" :key="index">
                        <a v-on:click="goToPath(file.path)" class="">
                            <span class="file-large-icon"><i :class="$store.getters.getIcon(file)"></i></span>
                            <br>{{file.name}}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
import router from "./../router.js";
export default {
    name: "FolderView",
    data: function () {
        return {
            folder_content: "",
            current_path : undefined
        }
    },
    created: function() {
        console.log("Creating folder view");
        this.$root.$on('updated-content', this.getFolderContents);
        var vm = this;
        window.addEventListener("popstate", function(event) {
            vm.getFolderContents();
        });
        this.getFolderContents();
    },
    beforeDestroy: function() {
        console.log("Destroying folder view");
        this.$root.$off('updated-content', this.getFolderContents);
    },
    updated: function() {
        this.getFolderContents();
    },
    methods: {
        getFolderContents : function(){
            var link = window.location.href.replace("#", "") + "?list=true";
            var vm = this;
            console.log(link);
            if(link == this.current_path) return;
            else this.current_path = link;
            axios.get(link).then(response => {
                vm.folder_content = response.data.files;
                vm.checkForIndex();
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                vm.$root.$emit('updated-breadcrumbs');
                vm.$root.$emit('updated-sidebar');
            })
            .then(function () {
                
            });
        },
        checkForIndex : function(){
            var foundIndex = false;
            for (let index = 0; index < this.folder_content.length; index++) {
                const element = this.folder_content[index];
                if(element.name == "index.md") {
                    var route = window.location.href.replace(window.location.host, "").replace("http://", "").replace("https://", "").replace("index.md", "");
                    route += "index.md";
                    console.log("Found index file: " + route);
                    router.push({path: route}).catch(err => { console.log(err)});;
                    foundIndex = true;
                    return;
                }
            }
            if(foundIndex == false){
                this.$root.$emit('updated-breadcrumbs');
                this.$root.$emit('updated-sidebar');
            }
        },
        goToPath: function(path){
            console.log("folder view button clicked");
            router.push({path: "/" + path}).catch(err => { console.log(err)});;
            this.$root.$emit('updated-content');
        },
    },
    computed: {
        
    }
}
</script>