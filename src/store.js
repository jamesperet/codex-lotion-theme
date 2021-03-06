import Vue from 'vue/dist/vue.js';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        vm : undefined,
        current_location : undefined,
        root : [],
        error : false,
        user : undefined,
        activity_messages : [],
        about : undefined
    },
    getters: {
        showError: (state, getters) => () =>{
            return state.error;
        },
        getUser: (state, getters) => () =>{
            return state.user;
        },
        getAbout: (state, getters) => () =>{
            return state.about;
        },
        getLocation: (state, getters) => () =>{
            return state.current_location;
        },
        getLocationCurrent: (state, getters) => () =>{
            var path = window.location.href.replace(window.location.host, "").replace("http://", "")
                .replace("https://", "").replace("#", "").replaceAll("%20", " ");
            return path;
        },
        getLocationPath: (state, getters) => () =>{
            var path = window.location.href.replace(window.location.host, "").replace("http://", "")
                .replace("https://", "").replace("#", "").replaceAll("%20", " ");
            var f = path.split("/").pop();
            if(f.includes(".")) path = path.replace(f, "");
            return path;
        },
        getLocationData: (state, getters) => (path) =>{
            var locations = [];
            var parts = path.split('?')[0].split("/");
            for (let p = 0; p < parts.length; p++) {
                if(parts[p] != "") locations.push(parts[p]);
            }
            var lookup = function(list, target){
                for (let i = 0; i < list.length; i++) {
                    if(list[i].name == target) return list[i];
                }
                return undefined;
            }
            if(state.root.length == 0) return false;
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
        formatDate: (state, getters) => (date) => {
            var d = new Date(date);
            var year = d.getFullYear();
            var month = d.getMonth();
            var day = d.getDate();
            var hour = d.getHours();
            var minutes = d.getMinutes();
            return `${month}/${day}/${year} ${hour}:${minutes}`;
        },
        formatSize: (state, getters) => (size) => {
            var size_in_mb = size / (1024*1024);
            if(size_in_mb > 0.01) {
                size_in_mb = (Math.round(size_in_mb * 100) / 100).toFixed(2);
                //console.log(size_in_mb.toString().split('').pop());
                if(size_in_mb.toString().split('').pop() == "0") size_in_mb = (Math.round(size_in_mb * 100) / 100).toFixed(1);
                return `${size_in_mb} Mb`
            }
            else return `${size} bytes`
        },
        getActivityMessages:  (state, getters) => (file) =>{
            return state.activity_messages;
        },
        createId: (state, getters) => (s) =>{
            s = s.replaceAll("/", "-").replaceAll(".", "-").replaceAll('#', '').replaceAll('--', '-').replaceAll("%20", "-");
            if(s.charAt(s.length - 1) == "-") s = s.slice(0, -1);
            s = s.toLowerCase();
            return s;
        },
        isImage: (state, getters) => (file) =>{
            switch(file.ext.toLowerCase()){
                case ".png":
                    return true;
                case ".jpg":
                    return true;
                case ".gif":
                    return true;
                case ".jpeg":
                    return true;
                default:
                    return false;
            }
        },
        getIconFromPath: (state, getters) => (path) => {
            var parts = path.split(".");
            var ext = "";
            var isFile = false;
            if(parts.length > 1) {
                ext = parts.pop();
                isFile = true;
            } else {
                isFile = false;
            }
            var dummyFile = {
                isFile : isFile,
                ext : "." + ext
            }
            return getters.getIcon(dummyFile);
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
                    //console.log(file.ext);
                    return "fas fa-file";
            }
        }
    },
    mutations: {
        setVm (state, vm) {
            state.vm = vm;
        },
        setLocation (state, location) {
            state.current_location = location
                .replace("#", "")
                .replace(window.location.host, "")
                .replace("http://", "")
                .replace("https://", "")
                .split('?')[0];
        },
        setFileStructure (state, fileStructure) {
            state.root = fileStructure;
        },
        setErrorState (state, errorState) {
            state.error = errorState;
        },
        setUser (state, user) {
            state.user = user;
        },
        setAbout (state, about) {
            state.about = about;
        },
        setActivityMessage (state, message){
            for (let i = 0; i < state.activity_messages.length; i++) {
                const msg = state.activity_messages[i];
                if(msg.id == message.id) {
                    state.activity_messages[i] = message;
                    state.vm.$root.$emit('update-activity-messages');
                    return;
                }
            }
            state.activity_messages.push(message);
            state.vm.$root.$emit('update-activity-messages');
        },
        removeActivityMessage (state, message){
            var index = state.activity_messages.findIndex(e => e.id === message.id);
            state.activity_messages.splice(index, 1);
        }
    },
    actions: {
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
        fileExists ({ commit }, data) {
            return new Promise((resolve, reject) => {
                var link = `${window.location.protocol}//${window.location.host}${data.path}?view=exists`;
                console.log("Checking for file " + link);
                axios.get(link).then(response => {
                    resolve(response);
                })
                .catch(function (error) {
                    console.log("Error checking for file (" + link + ")");
                    console.log(error);
                    reject(error);
                })
            })
        },
        createFile ({ commit }, data) {
            return new Promise((resolve, reject) => {
                var link = `${window.location.protocol}//${window.location.host}${data.path}${data.filename}`;
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
                var link = `${window.location.protocol}//${window.location.host}/api/create_folder`;
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
                var link = `${window.location.protocol}//${window.location.host}/api/move`;
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
                var link = `${window.location.protocol}//${window.location.host}/api/delete`;
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
        archive ({ commit }, data) {
            return new Promise((resolve, reject) => {
                var link = `${window.location.protocol}//${window.location.host}/api/archive`;
                var file_list = data.paths;
                var payload = {
                    method: 'post',
                    url: link,
                    data: {
                      title: data.title,
                      paths: file_list
                    },
                    headers: { 'content-type': 'application/json' },
                    responseType: 'json'
                }
                console.log("Archiving:", file_list);
                console.log("Archiving server payload:", payload);
                axios(link, payload).then(response => {
                    resolve(response);
                })
                .catch(function (error) {
                    console.log("Error archiving files:", file_list);
                    console.log(error);
                    reject(error);
                })
            })
        },
        download ({ commit }, data) {
            return new Promise((resolve, reject) => {
                axios.get(data.url, { responseType: 'blob' })
                .then(response => {
                    const blob = new Blob([response.data])
                    const link = document.createElement('a')
                    link.href = URL.createObjectURL(blob)
                    link.download = data.label
                    link.click()
                    URL.revokeObjectURL(link.href)
                    resolve();
                }).catch((err) => {
                    console.log(err);
                    reject;
                });
            });
        },
        requestUserData ({ commit }) {
            return new Promise((resolve, reject) => {
                axios.get('/api/user')
                .then(response => {
                    commit("setUser", response.data.user);
                    resolve();
                }).catch((err) => {
                    console.log(err);
                    reject();
                });
            });
        },
        getCodexTitle ({ commit }) {
            return new Promise((resolve, reject) => {
                axios.get('/api/about')
                .then(response => {
                    commit("setAbout", response.data.about);
                    resolve(response.data.about);
                }).catch((err) => {
                    console.log(err);
                    reject();
                });
            });
        },
    }
});

export default store;