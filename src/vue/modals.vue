<template>
    <div>
        <!-- CreateFolderModal -->
        <div class="modal fade" id="CreateFolderModal" tabindex="-1" aria-labelledby="CreateFolderModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="CreateFolderModalLabel">Create new folder</h5>
                    <a class="badge-link" data-bs-dismiss="modal" aria-label="Close" style="margin-top: 2px;">
                        <i class="fas fa-times"></i>
                    </a>
                </div>
                <div class="modal-body">
                    <input type="name" v-model="folderName" class="form-control" id="folderName" placeholder="example-folder-name">
                </div>
                <div class="modal-footer">
                    <a  class="badge-link" data-bs-dismiss="modal">Cancel</a>
                    <a class="badge-link" data-bs-dismiss="modal" v-on:click="createFolder()">Create</a>
                </div>
                </div>
            </div>
        </div>

        <!-- CreateFileModal -->
        <div class="modal fade" id="CreateFileModal" tabindex="-1" aria-labelledby="CreateFileModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="CreateFileModalLabel">Create new markdown file</h5>
                    <a class="badge-link" data-bs-dismiss="modal" aria-label="Close" style="margin-top: 2px;">
                        <i class="fas fa-times"></i>
                    </a>
                </div>
                <div class="modal-body">
                    <input type="name" v-model="fileName" class="form-control" id="fileName" placeholder="example-file-name">
                </div>
                <div class="modal-footer">
                    <a  class="badge-link" data-bs-dismiss="modal">Cancel</a>
                    <a class="badge-link" data-bs-dismiss="modal" v-on:click="createFile('.md')">Create</a>
                </div>
                </div>
            </div>
        </div>

        <!-- RenameModal -->
        <div class="modal fade" id="RenameModal" tabindex="-1" aria-labelledby="RenameModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="RenameModalLabel">Rename {{current_path_type}}</h5>
                    <a class="badge-link" data-bs-dismiss="modal" aria-label="Close" style="margin-top: 2px;">
                        <i class="fas fa-times"></i>
                    </a>
                </div>
                <div class="modal-body">
                    <input type="name" v-model="newName" class="form-control" id="newName" placeholder="new-example-name">
                </div>
                <div class="modal-footer">
                    <a  class="badge-link" data-bs-dismiss="modal">Cancel</a>
                    <a class="badge-link" data-bs-dismiss="modal" v-on:click="rename()">Rename</a>
                </div>
                </div>
            </div>
        </div>

        <!-- MoveModal -->
        <div class="modal fade" id="MoveModal" tabindex="-1" aria-labelledby="MoveModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="MoveModalLabel">Move {{current_path_type}}</h5>
                    <a class="badge-link" data-bs-dismiss="modal" aria-label="Close" style="margin-top: 2px;">
                        <i class="fas fa-times"></i>
                    </a>
                </div>
                <div class="modal-body">
                    <input type="name" v-model="newPath" class="form-control" id="newPath" placeholder="new-path/example-folder">
                </div>
                <div class="modal-footer">
                    <a  class="badge-link" data-bs-dismiss="modal">Cancel</a>
                    <a class="badge-link" data-bs-dismiss="modal" v-on:click="move()">Move</a>
                </div>
                </div>
            </div>
        </div>

        <!-- UploadModal -->
        <uploader></uploader>

    </div>
</template>

<script>
import router from "./../router.js";
import uploader from "./uploader.vue";
export default {
    name: "Modals",
    components: { 'uploader' : uploader },
    data: function () {
        return {
            folderName: "",
            fileName: "",
            newName: "",
            newPath: "",
            current_path_type: ""
        }
    },
    props: [],
    created: function() {
        console.log("Creating modals component");
        this.$root.$on('updated-content', this.updateModals);
        // Enable stuff
        this.$nextTick(function () {
            var createFolderModal = document.getElementById('CreateFolderModal')
            var folderNameInput = document.getElementById('folderName')
            createFolderModal.addEventListener('shown.bs.modal', function () {
                folderNameInput.focus();
            })
            var createFileModal = document.getElementById('CreateFileModal')
            var fileNameInput = document.getElementById('fileName')
            createFileModal.addEventListener('shown.bs.modal', function () {
                fileNameInput.focus();
            })
            var renameModal = document.getElementById('RenameModal')
            var newNameInput = document.getElementById('newName')
            renameModal.addEventListener('shown.bs.modal', function () {
                newNameInput.focus();
            })
            var moveModal = document.getElementById('MoveModal')
            var newPathInput = document.getElementById('newPath')
            moveModal.addEventListener('shown.bs.modal', function () {
                newPathInput.focus();
            });
            this.updateModals();
        });
    },
    beforeDestroy: function() {
        this.$root.$off('updated-content', this.updateModals);
    },
    updated: function() {
        
    },
    watch: {
        
    },
    methods: {
        updateModals: function(){
            var current_loc = this.$store.getters.getLocationCurrent();
            //console.log("updating modals data for " + current_loc);
            this.newName = this.$store.getters.getLocationData(current_loc).name;
            this.newPath = this.$store.getters.getLocationData(current_loc).folder;
            if(this.newName == undefined && this.newPath == undefined){
                setTimeout(this.updateModals, 500);
            }
        },
        createFile: function(ext){
            var path = this.$store.getters.getLocationPath();
            var file_path = path + this.fileName + ext
            var payload = { path: path, filename: this.fileName + ext, content: "" };
            var id = this.$store.getters.createId(file_path);
            this.$store.commit("setActivityMessage", { id : id, text: `Creating file \'${file_path}\'`, status: 'incomplete'} );
            this.$store.dispatch('createFile', payload).then((response) => {
                //console.log(response);
                this.$store.commit("setActivityMessage", { id : id, text: `Created file \'${file_path}\'`, status: 'success'} );
                this.fileName = "";
                console.log("new file created in " + file_path);
                router.push({path: file_path}).catch(err => { console.log(err)});
                this.$root.$emit('refresh-sidebar');
                this.$root.$emit('updated-content');
            }).catch(err => { 
                console.log(err);
                this.$store.commit("setActivityMessage", { id : id, text: `Error creating file \'${file_path}\'`, status: 'error', error : err} );
            });
        },
        createFolder: function(){
            var path = this.$store.getters.getLocationPath();
            path = path + this.folderName;
            var payload = { path: path };
            var id = this.$store.getters.createId(path);
            this.$store.commit("setActivityMessage", { id : id, text: `Creating folder \'${path}\'`, status: 'incomplete'} );
            this.$store.dispatch('createFolder', payload).then((response) => {
                //console.log(response);
                this.$store.commit("setActivityMessage", { id : id, text: `Created folder \'${path}\'`, status: 'success'} );
                console.log("new file created in " + path);
                this.folderName = "";
                router.push({path: path}).catch(err => { console.log(err)});
                this.$root.$emit('refresh-sidebar');
                this.$root.$emit('updated-content');
            }).catch(err => { 
                console.log(err)
                this.$store.commit("setActivityMessage", { id : id, text: `Error creating folder \'${path}\'`, status: 'error', error : err} );
            });
        },
        rename: function(){
            var path = this.$store.getters.getLocationCurrent();
            var new_path = "";
            var location_data = this.$store.getters.getLocationData(path);
            if(location_data.isFile){
                new_path = this.$store.getters.getLocationPath() + this.newName + location_data.ext;
            } else {
                new_path = location_data.folder + this.newName;
            }
            var payload = { path: path, new_path: new_path };
            this.changePath(payload, 'rename');
        },
        move: function(){
            var path = this.$store.getters.getLocationCurrent();
            var new_path = "";
            var location_data = this.$store.getters.getLocationData(path);
            if(location_data.isFile){
                new_path =  "/" + this.newPath + "/" + location_data.name;
            } else {
                new_path = "/" + this.newPath + "/" + location_data.name;
            }
            var payload = { path: path, new_path: new_path };
            this.changePath(payload, 'move');
        },
        changePath: function(payload, actionType){
            payload.new_path = payload.new_path.replaceAll("//", "/");
            console.log(payload);
            var id = this.$store.getters.createId(payload.new_path);
            this.$store.commit("setActivityMessage", { 
                id : id, 
                text: `${actionType == 'move' ? 'Moving ' : 'Renaming'} \'${payload.path}\' to \'${payload.new_path}\'`, 
                status: 'incomplete'
            } );
            this.$store.dispatch('move', payload).then((response) => {
                console.log(response);
                this.$store.commit("setActivityMessage", { 
                    id : id, 
                    text: `${actionType == 'move' ? 'Moved ' : 'Renamed'} \'${payload.path}\' to \'${payload.new_path}\'`, 
                    status: 'success'
                } );
                router.push({path: payload.new_path}).catch(err => { console.log(err)});
                this.$root.$emit('refresh-sidebar');
                this.$root.$emit('updated-content');
            }).catch(err => { 
                console.log(err);
                this.$store.commit("setActivityMessage", { 
                    id : id, 
                    text: `Error ${actionType == 'move' ? 'moving ' : 'renaming'} \'${payload.path}\' to \'${payload.new_path}\'`, 
                    status: 'error',
                    error: err
                } );
            });
        }
    },
    computed: {
        
    }
}
</script>