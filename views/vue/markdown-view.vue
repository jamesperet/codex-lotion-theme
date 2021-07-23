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
        console.log("Creating markdown view");
        bus.$on('updated-content', this.getContent);
        var vm = this;
        window.addEventListener("popstate", function(event) {
            vm.getContent();
        });
        this.getContent();
    },
    beforeDestroy: function() {
        console.log("Destroying markdown view");
        bus.$off('updated-content', this.getContent);
    },
    updated: function() {
        this.getContent();
    },
    methods: {
        getContent: function () {
            var link = window.location.href.replace("#", "") + "?view=content";
            console.log("Loading " + link);
            axios.get(link).then(response => {
                this.module_data = response.data.body;
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
                bus.$emit('updated-breadcrumbs');
                bus.$emit('updated-sidebar');
                bus.$emit('updated-links');
            });
        }
    }
}
</script>