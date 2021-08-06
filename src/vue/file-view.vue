<template>
    <div class="row align-items-center justify-content-center" 
        style="height: 100%; text-align: center;">
        <div class="col-6" v-if="file_data.name != ''">
        <h1><i :class="$store.getters.getIcon(file_data)"></i> {{file_data.name}}</h1>
        <p class="small">
            Updated: {{$store.getters.formatDate(file_data.mtime)}}<br>
            Size: {{$store.getters.formatSize(file_data.size)}}
        </p>
        <a v-on:click="downloadFile(file_data.folder + file_data.name + '?view=content')" class="badge-link execute-default">
            Download File
        </a>
        </div>
    </div>
</template>

<script>
import router from "./../router.js";
export default {
    name: "FileView",
    data: function () {
        return {
            file_data : {
                name : ""
            }
        }
    },
    created: function() {
        console.log("Creating File View");
        this.$root.$on('updated-content', this.getFileData);
        var vm = this;
        window.addEventListener("popstate", function(event) {
            vm.getFileData();
        });
        this.$root.$emit('updated-sidebar');
        this.getFileData();
    },
    beforeDestroy: function() {
        console.log("Destroying File View");
        this.$root.$off('updated-content', this.getFileData);
    },
    updated: function() {
        
    },
    methods: {
        getFileData: function(){
            this.$store.commit("setErrorState", false);
            var link = window.location.href.replace("#", "").split('?')[0] + "?view=exists";
            var vm = this;
            this.$root.$emit('hide-save');
            axios.get(link).then(response => {
                var loc = vm.$store.getters.getLocationCurrent();
                var file_data = vm.$store.getters.getLocationData(loc);
                if(file_data == false){
                    setTimeout(vm.getFileData, 500);
                } else {
                    if(!vm.$store.getters.isImage(file_data) && loc.split('?').length > 0){
                        router.push({path: loc.split('?')[0]}).catch(err => { console.log(err)});
                    }
                    vm.file_data = file_data;
                    vm.$root.$emit('updated-breadcrumbs');
                    vm.$root.$emit('updated-sidebar');
                    vm.$forceUpdate();
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                vm.$store.commit("setErrorState", true);
                vm.$root.$emit('updated-breadcrumbs');
                vm.$root.$emit('updated-sidebar');
            })
            .then(function () {
                
            });
        },
        downloadFile: function(link){
            window.location.href = link;
        }
    }
}
</script>