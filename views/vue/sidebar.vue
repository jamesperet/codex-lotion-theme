<template>
    <div class="sidebar">
        <div class="divider-text" style="margin-top: 12px;">FILES</div>
        <div class="list-group list-group-flush">
            <sidebar-file v-for="file in current_directory" :key="file.key" v-bind:content="file" v-bind:depth="0"></sidebar-file>
        </div>
        <hr>
        <div style="padding-left: 12px; padding-right: 12px padding-bottom: 12px; margin-bottom: 12px;">
            <div class="dropdown">
                <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="https://github.com/mdo.png" alt="" width="32" height="32" class="rounded-circle me-2">
                    <strong>mdo</strong>
                </a>
                <ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                    <li><a class="dropdown-item" href="#">New project...</a></li>
                    <li><a class="dropdown-item" href="#">Settings</a></li>
                    <li><a class="dropdown-item" href="#">Profile</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#">Sign out</a></li>
                </ul>
            </div>
        </div>
        
    </div>
</template>

<script>
module.exports = {
    name: "Sidebar",
    components: components,
    data: function () {
        return {
            current_directory : []
        }
    },
    created: function() {
        bus.$on('updated-sidebar', this.getCurrentDirectory);
    },
    beforeDestroy: function() {
        bus.$off('updated-sidebar', this.getCurrentDirectory);
    },
    updated: function() {
        
    },
    methods: {
        getCurrentDirectory: function() {
            //this.current_directory = [];
            var link = window.location.href.replace("#", "") + "?list=true";
            axios.get("/api/routes").then(response => {
                response.data.files.forEach(element => {
                    //console.log(element);
                    element.opened = false;
                    var duplicate = false;
                    for (let i = 0; i < this.current_directory.length; i++) {
                        const file = this.current_directory[i];
                        if(file.name == element.name) duplicate = true;
                    }
                    if(!duplicate) this.current_directory.push(element);
                });
                this.openSidebarToPath();
            });
        },
        openSidebarToPath: function() {
            var link = window.location.href.replace(window.location.host, "").replace("http://", "").replace("https://", "").replace("#", "");
            var link_parts = link.split("/");
            console.log(link_parts);
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
            var s = link.replace("http://", "").replace("https://", "").replace("#", "").replace("/","").replaceAll("/","-").replaceAll(".", "");
            if(s.charAt(s.length - 1) == "-") s = s.slice(0, -1);
            s = s.toLowerCase();
            console.log(s);
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
        }
    }
}
</script>