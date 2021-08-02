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
            breadcrumbs : [],
            current_path : undefined
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
            var route = window.location.href.replace(window.location.host, "").replace("http://", "").replace("https://", "").replace("#", "");
            if(this.current_path == route) return;
            this.breadcrumbs = [];
            console.log("route: " + route);
            var list = route.split("/");
            var link = "";
            for (let i = 0; i < list.length; i++) {
                if(list[i] != ""){
                    link += "/" + list[i];
                    if(link.split(".").length == 1) link += "/";
                    var crumb = {
                        title : list[i],
                        link : link
                    }
                    this.breadcrumbs.push(crumb);
                }
            }
            this.current_path = route;
        }
    }
}
</script>