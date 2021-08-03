<template>
    <div>
        <a :id="getId()"
            class="list-group-item list-group-item-action text-truncate" 
            :class="isCurrentLocation ? 'active' : ''" aria-current="true" style="cursor: pointer;">
                <span v-bind:style="{ marginLeft: depth * 14 + (!content.isFile ? 14 : 0) + 'px' }"></span>
                <div v-if="content.opened && content.isFile" v-on:click="closeFolder()" class="arrow-down"></div>
                <div v-if="!content.opened && content.isFile" v-on:click="openFolder()" class="arrow-right"></div>
                <span class="file-icon">
                    <i :class="$store.getters.getIcon(content)"></i>
                </span>
                <span v-on:click="goToPath(content.path)">{{content.name}}</span>
        </a>
        <div v-if="content.opened">
            <sidebar-file v-for="c in content.folder_contents" :key="c.key" v-bind:content="c" v-bind:depth="depth + 1"></sidebar-file>
        </div>
    </div>
</template>

<script>
import router from "./../router.js";
export default {
    name: "SidebarFile",
    data: function () {
        return {
            current_location : ''
        }
    },
    props: ['content', 'depth'],
    created: function() {
        this.$root.$on('updated-sidebar', this.updateData);
        this.updateData();
    },
    beforeDestroy: function() {
        this.$root.$off('updated-sidebar', this.updateData);
    },
    updated: function() {
        //console.log(content.key);
    },
    watch: {
        // This would be called anytime the value of title changes
        content : function(newValue, oldValue) {
            console.log("sidebar file content changed");
        }
    },
    methods: {
        goToPath: function(path){
            
            console.log("sidebar button clicked");
            router.push({path: "/" + path}).catch(err => { console.log(err)});
            this.$root.$emit('updated-content');
        },
        updateData: function(){
            this.current_location = window.location.href.replace(window.location.host, "").replace("http://", "").replace("https://", "").replace("#", "");
            //if(this.content != undefined) this.$forceUpdate();
        },
        openFolder: function(){
            this.content.opened = true;
            console.log("Opened folder " + this.content.path);
            this.$forceUpdate();
        },
        closeFolder: function(){
            this.content.opened = false;
            console.log("Closed folder " + this.content.path);
            this.$forceUpdate();
        },
        getId: function(){
            var s = this.content.path.replace("http://", "").replace("https://", "").replace("#", "").replace("/","").replaceAll("/","-").replaceAll(".", "").replaceAll("%20", "-");
            if(s.charAt(s.length - 1) == "-") s = s.slice(0, -1);
            s = s.toLowerCase();
            return s;
        }
    },
    computed: {
        isCurrentLocation: function () {
            return this.current_location == this.content.path;
        }
    }
}
</script>