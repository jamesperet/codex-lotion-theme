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
module.exports = {
    name: "FolderView",
    data: function () {
        return {
            folder_content: "",
            current_path : undefined
        }
    },
    created: function() {
        console.log("Creating folder view");
        bus.$on('updated-content', this.getFolderContents);
        var vm = this;
        window.addEventListener("popstate", function(event) {
            vm.getFolderContents();
        });
        this.getFolderContents();
    },
    beforeDestroy: function() {
        console.log("Destroying folder view");
        bus.$off('updated-content', this.getFolderContents);
    },
    updated: function() {
        this.getFolderContents();
    },
    methods: {
        getFolderContents : function(){
            var link = window.location.href.replace("#", "") + "?list=true";
            if(link == this.current_path) return;
            else this.current_path = link;
            axios.get(link).then(response => {
                this.folder_content = response.data.files;
                this.checkForIndex();
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                bus.$emit('updated-breadcrumbs');
                bus.$emit('updated-sidebar');
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
                    router.push({path: route});
                    foundIndex = true;
                    return;
                }
            }
            if(foundIndex == false){
                bus.$emit('updated-breadcrumbs');
                bus.$emit('updated-sidebar');
            }
        },
        goToPath: function(path){
            console.log("folder view button clicked");
            router.push({path: "/" + path});
            bus.$emit('updated-content');
        },
        getIcon: function(file){
            if(file.isFile == true) return "far fa-folder";
            switch(file.ext.toLowerCase()){
                case "":
                    return "far fa-folder";
                case ".png":
                    return "far fa-image";
                case ".jpg":
                    return "far fa-image";
                case ".gif":
                    return "far fa-image";
                case ".jpeg":
                    return "far fa-image";
                case ".zip":
                    return "far fa-file-archive";
                case ".tgz":
                    return "far fa-file-archive";
                case ".7z":
                    return "far fa-file-archive";
                case ".js":
                    return "fab fa-js-square";
                case ".css":
                    return "fab fa-css3";
                case ".md":
                    return "fas fa-file-alt";
                case ".markdown":
                    return "fas fa-file-alt";
                case ".pdf":
                    return "fas fa-file-pdf";
                case ".sh":
                    return "fas fa-file-code";
                case ".csharp":
                    return "fas fa-file-code";
                case ".py":
                    return "fas fa-file-code";
                case ".mp3":
                    return "fas fa-file-audio";
                case ".mp4":
                    return "fas fa-file-audio";
                case ".wav":
                    return "fas fa-file-audio";
                case ".aiff":
                    return "fas fa-file-audio";
                case ".m4v":
                    return "fas fa-file-video";
                case ".mov":
                    return "fas fa-file-video";
                case ".avi":
                    return "fas fa-file-video";
                case ".mkv":
                    return "fas fa-file-video";
                default:
                    console.log(file.ext);
                    return "far fa-file";
            }
        }
    },
    computed: {
        
    }
}
</script>