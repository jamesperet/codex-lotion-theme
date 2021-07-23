<template>
    <div>
        <a v-on:click="goToPath(content.path)" :href="content.path" class="list-group-item list-group-item-action text-truncate" aria-current="true">
                <div v-if="content.opened" class="arrow-down"></div>
                <div v-if="!content.opened" class="arrow-right"></div>
                {{content.name}}
        </a>
        <div v-if="content.opened" style="margin-left: 10px">
            <sidebar-file v-for="c in content.folder_contents" :key="c.key" v-bind:content="c"></sidebar-file>
        </div>
    </div>
</template>

<script>
module.exports = {
    name: "SidebarFile",
    props: ['content'],
    created: function() {
        bus.$on('updated-sidebar', this.updateData);
    },
    beforeDestroy: function() {
        bus.$off('updated-sidebar', this.updateData);
    },
    updated: function() {
        //console.log(content.key);
    },
    methods: {
        goToPath: function(path){
            console.log("sidebar button clicked");
            router.push({path: "/" + path});
            bus.$emit('updated-content');
        },
        updateData: function(){
            //if(this.content != undefined) this.$forceUpdate();
        }
    }
}
</script>