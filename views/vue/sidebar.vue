<template>
    <div class="sidebar">
        <div class="divider-text" style="margin-top: 12px;">FILES</div>
        <div class="list-group list-group-flush">
            <a v-for="file in current_directory" :key="file.name" v-on:click="goToPath(file.path)" :href="file.name" class="list-group-item list-group-item-action" aria-current="true">
                <div class="arrow-right"></div>{{file.name}}
            </a>
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
    data: function () {
        return {
            current_directory : []
        }
    },
    created: function() {
        this.getCurrentDirectory();
    },
    beforeDestroy: function() {
        
    },
    updated: function() {
        
    },
    methods: {
        getCurrentDirectory: function() {
            var link = window.location.href.replace("#", "") + "?list=true";
            axios.get(link).then(response => {
                response.data.files.forEach(element => {
                    this.current_directory.push(element);
                });
            });
        },
        goToPath: function(path){
            console.log("sidebar button clicked");
            //router.push({path: "/" + path});
            //bus.$emit('updated-content');
        }
    }
}
</script>