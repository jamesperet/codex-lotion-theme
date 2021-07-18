<template>
    <nav style="--bs-breadcrumb-divider: '/';" aria-label="breadcrumb">
        <ol class="breadcrumb" style="margin-bottom: 4px; margin-top: 4px;">
            <li v-for="breadcrumb in breadcrumbs" class="breadcrumb-item" :key="breadcrumb.title">
                <a class="badge-link" :href="breadcrumb.link">{{breadcrumb.title}}</a>
            </li>

        </ol>
    </nav>
</template>

<script>
module.exports = {
    name: "Breadcrumbs",
    data: function () {
        return {
            breadcrumbs : []
        }
    },
    created: function() {
        this.setBreadcrumb();
        bus.$on('updated-breadcrumbs', this.setBreadcrumb);
    },
    beforeDestroy: function() {
        bus.$off('updated-breadcrumbs', this.setBreadcrumb);
    },
    updated: function() {
        
    },
    methods: {
        setBreadcrumb: function() {
            this.breadcrumbs = [];
            var route = window.location.href.replace(window.location.host, "").replace("http://", "").replace("https://", "").replace("#", "");
            console.log("route: " + route);
            var list = route.split("/");
            var link = "";
            for (let i = 0; i < list.length; i++) {
                if(list[i] != ""){
                    link += "/" + list[i];
                    var crumb = {
                        title : list[i],
                        link : link
                    }
                    this.breadcrumbs.push(crumb);
                }
            }
        }
    }
}
</script>