<template>
    <div id="ImageSlider" class="">
        <img id="image" :src="slides[0].image" class="center">
        <!-- <img v-for="(slide, i) in slides" :key="i" :src="slide.image" class="center"> -->
        <!-- <div>
            <img id="image" :src="slides[0].image" alt="Picture" style="display: none;">
        </div> -->
        <!-- <div>
            <ul id="images">
                <li v-for="(slide, i) in slides" :key="i" class="hide"><img :src="slide.image"></li>
            </ul>
        </div> -->
    </div>
    
</template>

<script>
import router from "./../router.js";
export default {
    name: "ImageView",
    components: {  },
    data: function () {
        return {
            slides : [],
            current_path : '',
            refresh_content: false,
            viewer : undefined
        }
    },
    created: function() {
        var path = this.$store.getters.getLocationCurrent();
        this.slides.push({image : window.location.protocol + "//" + window.location.host + path + "?view=raw" });
        console.log("Creating image view");
        this.$root.$emit('hide-save');
        this.$root.$on('updated-content', this.showImage);
        this.$root.$on('refresh-content', this.refreshView);
        var vm = this;
        window.addEventListener("popstate", function(event) {
            vm.showImage();
        });
        this.showImage();
    },
    beforeDestroy: function() {
        console.log("Destroying image view");
        this.$root.$off('updated-content', this.showImage);
        this.$root.$off('refresh-content', this.refreshView);
    },
    updated: function() {
        
    },
    methods: {
        showImage: function(){
            var vm = this;
            var path = this.$store.getters.getLocationCurrent();
            this.$store.dispatch('fileExists', { path: path })
                .then((response) => {
                    console.log('File exists reponse', response);
                    console.log("Image exists");
                    var link =  window.location.protocol + "//" + window.location.host + path + "?view=raw";
                    vm.slides = [];
                    vm.slides.push({image: link });
                    vm.$store.commit("setErrorState", false);
                    vm.$root.$emit('updated-breadcrumbs');
                    vm.$root.$emit('updated-sidebar');
                    this.$forceUpdate();
                    // vm.getFolderContents();
                }).catch(err => { 
                    vm.$store.commit("setErrorState", true);
                    console.log(err)
                });
        },
        getFolderContents: function(){
            var path = this.$store.getters.getLocationPath();
            console.log("image folder path: ", path);
            var link = window.location.protocol + "//" + window.location.host + path;
            console.log("image folder link: ", link);
            var vm = this;
            if(link == this.current_path && this.refresh_content == false) return;
            this.current_path = link;
            var changed = false;
            axios.get(link + "?list=true").then(response => {
                for (let i = 0; i < response.data.files.length; i++) {
                    const file = response.data.files[i];
                    var found = false;
                    var file_link = link + file.name + "?view=raw";
                    console.log("file link: " + file_link);
                    for (let a = 0; a < vm.slides.length; a++) {
                        if(file_link == vm.slides[a].image) found = true;
                    }
                    if(found == false){
                        if(file.ext == '.jpg' || file.ext == '.jpeg' || file.ext == '.png' || file.ext == '.gif'){
                            vm.slides.push({ image : file_link });
                            changed = true;
                        }
                    }
                }
                if(changed) {
                    this.$forceUpdate();
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
        },
        refreshView: function(){
            this.refresh_content = true;
            this.showImage();
        }
    }
}
</script>