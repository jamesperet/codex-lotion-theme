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
        <a class="badge-link" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-html="true" 
            title="Pin this page <br>in your sidebar">
            <i class="far fa-star"></i>
        </a>
        
        <div class="dropdown" style="display: inline;">

            <a class="badge-link" id="dropdownUser1" data-bs-toggle="dropdown" 
                aria-expanded="false">
                <i class="fas fa-ellipsis-h" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-html="true" 
                    title="Create, edit <br>and delete files"></i>
            </a>
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                <li><a class="dropdown-item" href="#">New project...</a></li>
                <li><a class="dropdown-item" href="#">Settings</a></li>
                <li><a class="dropdown-item" href="#">Profile</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#">Sign out</a></li>
            </ul>
        </div>
    </div>
    
</template>

<script>
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
        }
    },
    computed: {
        
    }
}
</script>