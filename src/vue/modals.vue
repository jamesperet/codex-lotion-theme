<template>
    <div>
        <!-- Modal -->
        <div class="modal fade" id="CreateFolderModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Create new folder</h5>
                    <a class="badge-link" data-bs-dismiss="modal" aria-label="Close" style="margin-top: 2px;">
                        <i class="fas fa-times"></i>
                    </a>
                </div>
                <div class="modal-body">
                    <input type="name" class="form-control" id="folderName" placeholder="example-folder-name">
                </div>
                <div class="modal-footer">
                    <a  class="badge-link" data-bs-dismiss="modal">Cancel</a>
                    <a class="badge-link">Create</a>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Modals",
    data: function () {
        return {
            
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
        
    },
    computed: {
        
    }
}
</script>