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
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                <li>
                    <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#CreateFolderModal">
                        <i class="fas fa-folder"></i>New folder
                    </a>
                </li>
                <li>
                    <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#CreateFileModal">
                        <i class="fas fa-file-alt"></i>New Markdown file
                    </a>
                </li>
                <li>
                    <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#UploadModal">
                        <i class="fas fa-upload"></i>File Upload
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
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                <!-- <li><a class="dropdown-item" href="#" v-on:click="testStoreAction()">
                        <i class="far fa-star"></i>Add to favorites
                    </a>
                </li> -->
                <!-- <li><a class="dropdown-item" href="#"><i class="fas fa-link"></i>Copy link</a></li> -->
                <li><a class="dropdown-item disabled" href="#"><i class="fas fa-file-export"></i>Export</a></li>
                <!-- <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-undo-alt"></i>Undo</a></li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-redo-alt"></i>Redo</a></li>
                <li><hr class="dropdown-divider"></li> -->
                <li>
                    <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#RenameModal">
                        <i class="fas fa-tag"></i>Rename
                    </a>
                </li>
                <li>
                    <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#MoveModal">
                        <i class="fas fa-level-down-alt"></i>Move to
                    </a>
                </li>
                <li>
                    <a class="dropdown-item" href="#" v-on:click="deleteCurrentPath()">
                        <i class="fas fa-trash-alt"></i>Delete
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
        testStoreAction: function(){
            this.$store.dispatch('testAction').then((data) => {
                console.log(data);
            })
        },
        deleteCurrentPath: function(){
            var path = this.$store.getters.getLocationCurrent();
            var payload = { path: path };
            this.$store.dispatch('delete', payload).then((response) => {
                console.log(response);
                var current = path.split("/").pop();
                var newPath = path.replace(current, "");
                if(path == newPath) newPath = "/";
                console.log("Deleted: " + path);
                console.log("Loading " + newPath)
                router.push({path: newPath}).catch(err => { console.log(err)});
                this.$root.$emit('refresh-sidebar');
                this.$root.$emit('updated-content');
            }).catch(err => { console.log(err)});
        }
    },
    computed: {
        
    }
}
</script>