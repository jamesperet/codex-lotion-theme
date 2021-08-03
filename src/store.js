import Vue from 'vue/dist/vue.js';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        
    },
    getters: {
        getIcon: (state, getters) => (file) =>{
            if(file.isFile == true) return "far fa-folder";
            switch(file.ext.toLowerCase()){
                case "":
                    return "far fa-folder";
                case ".png":
                    return "far fa-image";
                case ".jpg":
                    return "far fa-image";
                case ".gif":
                    return "far fa-image";
                case ".jpeg":
                    return "far fa-image";
                case ".zip":
                    return "far fa-file-archive";
                case ".tgz":
                    return "far fa-file-archive";
                case ".7z":
                    return "far fa-file-archive";
                case ".js":
                    return "fab fa-js-square";
                case ".css":
                    return "fab fa-css3";
                case ".md":
                    return "fas fa-file-alt";
                case ".markdown":
                    return "fas fa-file-alt";
                case ".pdf":
                    return "fas fa-file-pdf";
                case ".sh":
                    return "fas fa-file-code";
                case ".csharp":
                    return "fas fa-file-code";
                case ".py":
                    return "fas fa-file-code";
                case ".json":
                    return "fas fa-file-code";
                case ".csv":
                    return "fas fa-file-csv";
                case ".mp3":
                    return "fas fa-file-audio";
                case ".mp4":
                    return "fas fa-file-audio";
                case ".wav":
                    return "fas fa-file-audio";
                case ".aiff":
                    return "fas fa-file-audio";
                case ".m4v":
                    return "fas fa-file-video";
                case ".mov":
                    return "fas fa-file-video";
                case ".avi":
                    return "fas fa-file-video";
                case ".mkv":
                    return "fas fa-file-video";
                case ".wmv":
                    return "fas fa-file-video";
                case ".html":
                    return "fas fa-file-code";
                default:
                    console.log(file.ext);
                    return "fa-file";
            }
        }
    },
    mutations: {},
    actions: {}
});

export default store;