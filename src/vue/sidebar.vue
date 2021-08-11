<template>
    <div class="sidebar">
        <div class="divider-text" style="margin-top: 12px;">FILES</div>
        <div class="list-group list-group-flush">
            <sidebar-file v-for="file in current_directory" :key="file.key" v-bind:content="file" v-bind:depth="0"></sidebar-file>
        </div>
        <hr>
        <user></user>
    </div>
</template>

<script>
import sidebarFile from './sidebar-file.vue';
import user from './user.vue';
export default {
    name: "Sidebar",
    components: {
        "SidebarFile": sidebarFile,
        "User": user,
    },
    data: function () {
        return {
            current_directory : [],
            current_path : undefined,
            refresh_view : false
        }
    },
    created: function() {
        this.$root.$on('updated-sidebar', this.getCurrentDirectory);
        this.$root.$on('refresh-sidebar', this.refreshView);
    },
    beforeDestroy: function() {
        this.$root.$off('updated-sidebar', this.getCurrentDirectory);
        this.$root.$off('refresh-sidebar', this.refreshView);
    },
    updated: function() {
        
    },
    methods: {
        getCurrentDirectory: function() {
            console.log("Updating sidebar");
            var link = window.location.href.replace("#", "") + "?list=true";
            if(!this.refresh_view){
                if(this.current_path == link) return;
            }
            this.current_path = link;
            if(this.refresh_view){
                this.current_directory = [];
            }
            this.$store.dispatch('getFileStructure').then((file_structure) => {
                file_structure.forEach(element => {
                    //console.log(element);
                    element.opened = false;
                    var duplicate = false;
                    for (let i = 0; i < this.current_directory.length; i++) {
                        const file = this.current_directory[i];
                        if(file.name == element.name) duplicate = true;
                    }
                    if(!duplicate) this.current_directory.push(element);
                });
                this.refresh_view = false;
                this.openSidebarToPath();
            }).catch(err => { });
        },
        openSidebarToPath: function() {
            var link = window.location.href.replace(window.location.host, "").replace("http://", "").replace("https://", "").replace("#", "");
            var link_parts = link.split("/");
            //console.log(link_parts);
            for (let a = 0; a < link_parts.length; a++) {
                if(link_parts[a] == "") {
                    link_parts.splice(a, 1);
                    break;
                }
            }
            for (let i = 0; i < this.current_directory.length; i++) {
                if(link_parts[0] != this.current_directory[i].name){
                    this.current_directory[i].opened = false;
                    this.current_directory[i].key = this.current_directory[i].name + "_closed"; 
                } 
            }
            var current_folder, current_index, base_folder_contents;
            for (let i = 0; i < this.current_directory.length; i++) {
                const file = this.current_directory[i];
                if(link_parts[0].toLowerCase() == file.name.toLowerCase()) {
                    //console.log("Found " + link_parts[0] + " - " + file.name);
                    file.opened = true;
                    this.current_directory[i].key = this.current_directory[i].name + "_opened";
                    if(file.folder_contents != undefined)  {
                        current_folder = file;
                        base_folder_contents = file.folder_contents;
                        current_index = i;
                    }
                }
            } 
            for (let a = 1; a < link_parts.length; a++) {
                if(current_folder != undefined){
                    current_folder = this.getContent(current_folder.folder_contents, link_parts[a]);
                }
            }
            if(this.current_directory[current_index] != undefined){
                this.current_directory[current_index].folder_contents = undefined;
            }
            this.$nextTick (() => {
                if(this.current_directory[current_index] != undefined){
                    this.current_directory[current_index].folder_contents = base_folder_contents;
                }
            });
            // Scroll sidebar to current link
            var s = link.replace("http://", "").replace("https://", "").replace("#", "").replace("/","").replaceAll("/","-").replaceAll(".", "").replaceAll("%20", "-");
            if(s.charAt(s.length - 1) == "-") s = s.slice(0, -1);
            s = s.toLowerCase();
            //console.log(s);
            const el = this.$el.querySelector("#" + s);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            //console.log(this.current_directory);
            this.$forceUpdate();
        },
        getContent: function(content, name){
            var return_content;
            for (let i = 0; i < content.length; i++) {
                //console.log(content[i].name + " is " + (content[i].opened ? "open" : "closed"));
                if(name.toLowerCase() == content[i].name.toLowerCase()) {
                    //console.log(content[i]);
                    content[i].opened = true;
                    content[i].key = content[i].name + "_opened";
                    return_content = content[i];
                } else if(content[i].opened) {
                    content[i].opened = false;
                    content[i].key = content[i].name + "_closed";
                    if(content[i].folder_contents != undefined) {
                        this.closeContent(content[i].folder_contents);
                    }
                } else {
                    
                }
            }
            return return_content;
        },
        closeContent: function(content){
            if(content == undefined) return;
            for (let i = 0; i < content.length; i++) {
                content[i].opened = false;
                content[i].key = content[i].name + "_closed";
                if(content[i].folder_contents != undefined) this.closeContent(content[i].folder_contents);
            }
        },
        refreshView: function(){
            this.refresh_view = true;
        }
    }
}
</script>