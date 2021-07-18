<template>
    <div v-html="module_data"></div>
</template>

<script>
module.exports = {
    name: "MarkdownView",
    data: function () {
        return {
            module_data: ""
        }
    },
    created: function() {
        console.log("Creating view");
        bus.$on('updated-content', this.getContent);
        bus.$on('updated-links', this.updateLinks);
        var vm = this;
        window.addEventListener("popstate", function(event) {
            vm.getContent();
        });
        this.getContent();
    },
    beforeDestroy: function() {
        console.log("Destroying view");
        bus.$off('updated-links', this.updateLinks);
        bus.$off('updated-content', this.getContent);
    },
    updated: function() {

    },
    methods: {
        getContent: function () {
            var link = window.location.href.replace("#", "") + "?view=content";
            console.log("Loading " + link);
            axios.get(link).then(response => {
                this.module_data = response.data.body;
                bus.$emit('updated-links');
                bus.$emit('updated-breadcrumbs');
            });
        },
        updateLinks: function() {
            var clickHandler = this.clickHandler;
            setTimeout(function () {
                var links = document.getElementsByTagName("a");
                //console.log(links);
                for (let i = 0; i < links.length; i++) {
                    const element = links[i];
                    element.removeEventListener("click", clickHandler);
                    element.addEventListener("click", clickHandler);     
                }
            }, 500);
        },
        removeLinks: function(){
            var links = document.getElementsByTagName("a");
            for (let i = 0; i < links.length; i++) {
                const element = links[i];
                element.removeEventListener("click", this);
            }
        },
        clickHandler: function(event){
            console.log("link clicked: " + event.target.href);
            this.removeLinks();
            if(event.target.host == window.location.host){
                event.preventDefault();
                var route = event.target.href.replace(window.location.host, "").replace("http://", "").replace("https://", "");
                var window_location = window.location.href.replace(window.location.host, "").replace("http://", "").replace("https://", "");
                if(route != window_location){
                    router.push({path: route});
                    bus.$emit('updated-content');
                }
            }
            //console.log(event);
        }
    }
}
</script>