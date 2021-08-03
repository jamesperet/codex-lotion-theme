import Vue from 'vue/dist/vue.js';
import router from "./router.js";
import store from "./store.js";

import folderView from './vue/folder-view.vue';
import markdownView from './vue/markdown-view.vue';
import breadcrumbs from './vue/breadcrumbs.vue';
import sidebar from './vue/sidebar.vue';
import sidebarFile from './vue/sidebar-file.vue';
import toolbar from './vue/toolbar.vue';

new Vue({
    el: '#app',
    components: {
        "FolderView" : folderView,
        "MarkdownView" : markdownView,
        "Breadcrumbs" : breadcrumbs,
        "Sidebar" : sidebar,
        "SidebarFile" : sidebarFile,
        "Toolbar" : toolbar
    },
    store: store,
    router: router,
    data: function () {
            return {  
        }
    },
    created: function() {
        console.log("Creating folder view");
        this.$root.$on('updated-links', this.updateLinks);
    },
    beforeDestroy: function() {
        console.log("Destroying folder view");
        this.$root.$off('updated-links', this.updateLinks);
    },
    updated: function() {
        this.updateLinks();
    },
    methods: {
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
                    this.$root.$emit('updated-content');
                }
            }
        }
    }
});