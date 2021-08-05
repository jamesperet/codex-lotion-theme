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
                    <a class="badge-link">Create</a>
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

    </div>
</template>

<script>
import router from "./../router.js";
export default {
    name: "Modals",
    data: function () {
        return {
            folderName: "",
            fileName: ""
        }
    },
    props: [],
    created: function() {
        this.$root.$on('?', ()=>{});
        // Enable stuff
        this.$nextTick(function () {
            var myModal = document.getElementById('CreateFolderModal')
            var myInput = document.getElementById('folderName')
            myModal.addEventListener('shown.bs.modal', function () {
                myInput.focus()
            })
        });
    },
    beforeDestroy: function() {
        this.$root.$off('?', ()=>{});
    },
    updated: function() {
        
    },
    watch: {
        
    },
    methods: {
        createFile: function(ext){
            var path = this.$store.getters.getLocationPath();
            var payload = { path: path, filename: this.fileName + ext, content: "" };
            this.$store.dispatch('createFile', payload).then((response) => {
                console.log(response);
                var newPath = path + this.fileName + ext;
                this.fileName = "";
                console.log("new file created in " + newPath);
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