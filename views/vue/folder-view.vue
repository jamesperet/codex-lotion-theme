<template>
    
</template>

<script>
module.exports = {
    name: "FolderView",
    data: function () {
        return {
            folder_content: ""
        }
    },
    created: function() {
        console.log("Creating folder view");
        bus.$on('updated-content', this.checkForIndex);
        var vm = this;
        window.addEventListener("popstate", function(event) {
            vm.checkForIndex();
        });
        this.checkForIndex();
    },
    beforeDestroy: function() {
        console.log("Destroying folder view");
        bus.$off('updated-content', this.checkForIndex);
    },
    updated: function() {
        this.checkForIndex();
    },
    methods: {
        checkForIndex : function(){
            var link = window.location.href.replace("#", "") + "?list=true";
            axios.get(link).then(response => {
                this.folder_content = response.data.files;
                for (let index = 0; index < this.folder_content.length; index++) {
                    const element = this.folder_content[index];
                    if(element.name == "index.md") {
                        var route = window.location.href.replace(window.location.host, "").replace("http://", "").replace("https://", "").replace("index.md", "");
                        route += "index.md";
                        console.log("Found index file: " + route);
                        router.push({path: route});
                    }
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                
            });
        }
    }
}
</script>