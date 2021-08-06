import Vue from 'vue/dist/vue.js';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        current_location : undefined,
        root : []
    },
    getters: {
        getLocation: (state, getters) => () =>{
            return state.current_location;
        },
        getLocationCurrent: (state, getters) => () =>{
            var path = window.location.href.replace(window.location.host, "").replace("http://", "")
                .replace("https://", "").replace("#", "");
            return path;
        },
        getLocationPath: (state, getters) => () =>{
            var path = window.location.href.replace(window.location.host, "").replace("http://", "")
                .replace("https://", "").replace("#", "");
            var f = path.split("/").pop();
            if(f.includes(".")) path = path.replace(f, "");
            return path;
        },
        getLocationData: (state, getters) => (path) =>{
            var locations = [];
            var parts = path.split("/");
            for (let p = 0; p < parts.length; p++) {
                if(parts[p] != "") locations.push(parts[p]);
            }
            var lookup = function(list, target){
                for (let i = 0; i < list.length; i++) {
                    if(list[i].name == target) return list[i];
                }
                return undefined;
            }
            var list = state.root;
            var data = {}
            for (let l = 0; l < locations.length; l++) {
                if(locations[l] == "") continue;
                var result = lookup(list, locations[l]);
                if(result != undefined) {
                    if(l == locations.length - 1) {
                        data = result;
                        break;
                    }
                    if(result.folder_contents != undefined) list = result.folder_contents;
                }
            }
            return data;
        },
        getIcon: (state, getters) => (file) =>{
            if(file.isFile == false) return "far fa-folder";
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
                    return "fas fa-file-video";
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
                    return "fas fa-file";
            }
        }
    },
    mutations: {
        setLocation (state, location) {
            state.current_location = location
                .replace("#", "")
                .replace(window.location.host, "")
                .replace("http://", "")
                .replace("https://", "");
        },
        setFileStructure (state, fileStructure) {
            state.root = fileStructure;
        },
    },
    actions: {
        testAction ({ commit }) {
            return new Promise((resolve, reject) => {
                var data = "";
                setTimeout(() => {
                    //commit('someMutation')
                    data = "done!";
                    resolve(data);
                }, 1000)
            })
        },
        getFileStructure ({commit}) {
            return new Promise((resolve, reject) => {
                axios.get("/api/routes").then(response => {
                    commit("setFileStructure", response.data.files);
                    resolve(response.data.files);
                })
                .catch(function (error) {
                    console.log(error);
                    reject(error);
                });
            })
        },
        createFile ({ commit }, data) {
            return new Promise((resolve, reject) => {
                var link = "http://" + window.location.host + data.path + data.filename;
                console.log("Creating file " + link);
                axios.post(link, {file : data.content}).then(response => {
                    resolve(response);
                })
                .catch(function (error) {
                    console.log("Error creating new file (" + link + ")");
                    console.log(error);
                    reject(error);
                })
            })
        },
        createFolder ({ commit }, data) {
            return new Promise((resolve, reject) => {
                var link = "http://" + window.location.host + "/api/create_folder";
                var path = data.path;
                console.log("Creating folder " + link);
                axios.post(link, {path : path}).then(response => {
                    resolve(response);
                })
                .catch(function (error) {
                    console.log("Error creating folder " + path);
                    console.log(error);
                    reject(error);
                })
            })
        },
        move ({ commit }, data) {
            return new Promise((resolve, reject) => {
                var link = "http://" + window.location.host + "/api/move";
                console.log("Moving " + data.path + " => " + data.new_path + "(" + link + ")");
                axios.post(link, data).then(response => {
                    resolve(response);
                })
                .catch(function (error) {
                    console.log("Error moving " + data.path);
                    console.log(error);
                    reject(error);
                })
            })
        },
        delete ({ commit }, data) {
            return new Promise((resolve, reject) => {
                var link = "http://" + window.location.host + "/api/delete";
                var path = data.path;
                console.log("Deleting " + link);
                axios.post(link, {path : path}).then(response => {
                    resolve(response);
                })
                .catch(function (error) {
                    console.log("Error deleting " + path);
                    console.log(error);
                    reject(error);
                })
            })
        },
    }
});

export default store;