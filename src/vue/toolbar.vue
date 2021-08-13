<template>
    <div class="toolbar" style="">
        <!-- <a class="badge-link active"><i class="far fa-file"></i></a>
        <a class="badge-link"><i class="fas fa-th-list"></i></a>
        <a class="badge-link"><i class="fas fa-th"></i></a>
        <span style="margin-left: 15px;"></span>
        <a class="badge-link"><i class="fas fa-plus"></i></a>
        <a class="badge-link"><i class="fas fa-edit"></i></a> -->

        <a class="badge-link" v-show="show_save" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-html="true" 
            title="save" v-on:click="saveDocument()">
            <i class="fas fa-save"></i>
        </a>

        <div class="dropdown" style="display: inline;">
            <a class="badge-link" id="dropdownUser1" data-bs-toggle="dropdown" 
                aria-expanded="false">
                <i class="fas fa-plus"></i>
            </a>
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark text-small shadow fa-ul" aria-labelledby="dropdownUser1">
                <li>
                    <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#CreateFolderModal">
                        <span class="fa-li"><i class="fas fa-folder"></i></span> <span class="title">folder</span>
                    </a>
                </li>
                <li>
                    <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#CreateFileModal">
                        <span class="fa-li"><i class="fas fa-file-alt"></i></span> <span class="title">Markdown file</span>
                    </a>
                </li>
                <li>
                    <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#UploadModal">
                        <span class="fa-li"><i class="fas fa-upload"></i></span> <span class="title">Upload</span>
                    </a>
                </li>
            </ul>
        </div>

        <!-- <a class="badge-link" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-html="true" 
            title="Pin this page <br>in your sidebar">
            <i class="far fa-star"></i>
        </a> -->
        
        <div class="dropdown" style="display: inline;">
            <a class="badge-link" id="dropdownUser1" data-bs-toggle="dropdown" 
                aria-expanded="false">
                <i class="fas fa-ellipsis-h" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-html="true" 
                    title="File and <br>folder actions"></i>
            </a>
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark text-small shadow fa-ul" aria-labelledby="dropdownUser1">
                <!-- <li><a class="dropdown-item" href="#" v-on:click="testStoreAction()">
                        <i class="far fa-star"></i>Add to favorites
                    </a>
                </li> -->
                <!-- <li><a class="dropdown-item" href="#"><i class="fas fa-link"></i>Copy link</a></li> -->
                <!-- <li><a class="dropdown-item disabled" href="#"><i class="fas fa-file-export"></i>Export</a></li> -->
                <li>
                    <a class="dropdown-item" href="#" v-on:click="download()">
                        <span class="fa-li"><i class="fas fa-download"></i></span> <span class="title">Download</span>
                    </a>
                </li>
                <!-- <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-undo-alt"></i>Undo</a></li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-redo-alt"></i>Redo</a></li>
                <li><hr class="dropdown-divider"></li> -->
                <li>
                    <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#RenameModal">
                        <span class="fa-li"><i class="fas fa-tag"></i></span> <span class="title">Rename</span>
                    </a>
                </li>
                <li>
                    <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#MoveModal">
                        <span class="fa-li"><i class="fas fa-level-down-alt"></i></span> <span class="title">Move to</span>
                    </a>
                </li>
                <li>
                    <a class="dropdown-item" href="#" v-on:click="deleteCurrentPath()">
                        <span class="fa-li"><i class="fas fa-trash-alt"></i></span> <span class="title">Delete</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    
</template>

<script>
import router from "./../router.js";
export default {
    name: "Toolbar",
    data: function () {
        return {
            current_location : '',
            show_save : false
        }
    },
    props: [],
    created: function() {
        this.$root.$on('show-save', this.showSave);
        this.$root.$on('hide-save', this.hideSave);
        // Enable Bootstrap tooltips
        this.$nextTick(function () {
            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl)
            })
        });
    },
    beforeDestroy: function() {
        this.$root.$off('show-save', this.showSave);
        this.$root.$off('hide-save', this.hideSave);
    },
    updated: function() {
        
    },
    watch: {
        
    },
    methods: {
        showSave: function(){
            this.show_save = true;
        },
        hideSave: function(){
            this.show_save = false;
        },
        saveDocument: function(){
            //console.log("Pressed save button");
            this.$root.$emit('save-document');
        },
        deleteCurrentPath: function(){
            var vm = this;
            var path = this.$store.getters.getLocationCurrent();
            var id = this.$store.getters.createId(path);
            vm.$store.commit("setActivityMessage", { id : id, text: `Deleting \'${path}\'`, status: 'incomplete'} );
            var payload = { path: path };
            this.$store.dispatch('delete', payload).then((response) => {
                console.log(response);
                vm.$store.commit("setActivityMessage", { id : id, text: `Deleted \'${path}\'`, status: 'success'} );
                var current = path.split("/").pop();
                var newPath = path.replace(current, "");
                if(path == newPath) newPath = "/";
                console.log("Deleted: " + path);
                console.log("Loading " + newPath)
                router.push({path: newPath}).catch(err => { console.log(err)});
                this.$root.$emit('refresh-sidebar');
                this.$root.$emit('updated-content');
            }).catch(err => { 
                console.log(err);
                vm.$store.commit("setActivityMessage", { id : id, text: `Error deleting \'${path}\'`, status: 'error', error : err} );
            });
        },
        download: function() {
            var path = this.$store.getters.getLocationCurrent();
            var path_data = this.$store.getters.getLocationData(path);
            var path_list = [];
            var title = "";
            var vm = this;
            var id = this.$store.getters.createId(path);
            this.$store.commit("setActivityMessage", { id : id, text: `Downloading \'${path}\'`, status: 'incomplete'} );
            if(path_data.isFile) {
                vm.$store.commit("setActivityMessage", { id : id, text: `Downloading file \'${path}\'`, status: 'incomplete'} );
                path_list.push(path_data.folder + path_data.name);
                title = path_data.name.split('.')[0];
                console.log(path_data);
                var fileDownloadPath = window.location.protocol + '//' + window.location.host
                fileDownloadPath += ("/" + path_data.folder + path_data.name).replace('//', '/');
                fileDownloadPath += '?view=raw';
                console.log(fileDownloadPath);
                vm.$store.dispatch('download', { url : fileDownloadPath, label: path_data.name})
                .then((response) => {
                    console.log("Downloading file...");
                    vm.$store.commit("setActivityMessage", { id : id, text: `Downloading file \'${path}\'`, status: 'success'} );
                }).catch(err => { 
                    console.log(err);
                    vm.$store.commit("setActivityMessage", { id : id, text: `Error downloading file \'${path}\'`, status: 'error', error : err} );
                });
                return;
            }
            else {
                // Current path is folder so add all files and child files into a path list
                title = path_data.name;
                vm.$store.commit("setActivityMessage", { id : id, text: `Archiving folder \'${path}\'`, status: 'incomplete'} );
                var add_paths = function(path_data_list){
                    for (let i = 0; i < path_data_list.length; i++) {
                        const element = path_data_list[i];
                        path_list.push(element.folder + element.name);
                        if(!element.isFile) {
                            add_paths(element.folder_contents);
                        }
                    }
                }
                add_paths(path_data.folder_contents);
            }
            var payload = { paths: path_list, title: title};
            this.$store.dispatch('archive', payload).then((response) => {
                console.log("archiving response:", response);
                vm.$store.commit("setActivityMessage", { id : id, text: `Downloading archive \'${path}\'.zip`, status: 'success'} );
                window.location.href = "/" + response.data.archive_path;
            }).catch(err => { 
                console.log(err);
                vm.$store.commit("setActivityMessage", { id : id, text: `Error creating archive for folder \'${path}\'`, status: 'error', error : err} );
            });
        }
    },
    computed: {
        
    }
}
</script>