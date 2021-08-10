<template>
    <div class="modal fade" id="UploadModal" tabindex="-1" aria-labelledby="UploadModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="UploadModalLabel">Upload files {{files.length > 0 ? '(' + files.length + ')' : ''}} </h5>
                <a class="badge-link" @click.prevent="closeModal()" aria-label="Close" style="margin-top: 2px;">
                    <i class="fas fa-times"></i>
                </a>
            </div>
            <div class="modal-body">
                <file-upload
                    id="FileUploader"
                    ref="upload"
                    v-model="files"
                    name="files"
                    :post-action="gettUrl()"
                    :drop="true"
                    :multiple="true"
                    :directory="true"
                    @input-file="inputFile"
                    @input-filter="inputFilter"
                    enctype="multipart/form-data"
                >
                    <div style="border: 2px dashed white; height: 150px; display: inline-block; width: 469px; text-align: center; 
                        margin-top: 6px; margin-bottom: 6px;">
                        <div style="padding: 18px;">
                            <h3 style="font-size: 2.4em"><i class="fas fa-cloud-upload-alt"></i></h3>
                            <p class="lead">Drag & Drop files here</p>
                        </div>
                    </div>
                </file-upload>
                <ul style="margin-top: 0px; margin-bottom: 0px; list-style: none; padding-left: 0px; max-height: 400px; 
                    overflow: scroll; padding-right: 12px; margin-right: -6px;">
                    <li v-for="file in files" :key="file.name" class="file-uploader-item">
                        <div class="row">
                            <div class="col-2" style="text-align: center;">
                                <i :class="$store.getters.getIconFromPath(file.name)" class="uploader-icon"></i>
                            </div>
                            <div class="col-10" style="padding-left: 0px;">
                                <p class="text-truncate" style="margin-right: 12px;">{{file.name}}</p>
                                <div class="progress" style="height: 5px; margin-bottom: 2px;">
                                    <div class="progress-bar progress-bar-striped" role="progressbar" v-bind:style="{ width: getProgressBarWidth(file) }"
                                        :aria-valuenow="file.progress" aria-valuemin="0" aria-valuemax="100"
                                        :class="`${file.success ? 'bg-success' : ''} ${file.error != '' ? 'bg-danger' : ''}`"></div>
                                </div>
                                <p v-show="file.error != ''"><small>Error: {{file.error}}</small></p>
                                <p v-show="file.error == undefined || file.error == ''">
                                    <small>{{$store.getters.formatSize(file.size)}}</small>
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="modal-footer">
                <a  v-show="!uploadComplete" class="badge-link" @click.prevent="closeModal()">Cancel</a>
                <a v-show="!$refs.upload || !$refs.upload.active && !uploadComplete" @click.prevent="$refs.upload.active = true" class="badge-link">
                    Start Upload
                </a>
                <a v-show="$refs.upload && $refs.upload.active && !uploadComplete" @click.prevent="$refs.upload.active = false" class="badge-link">
                    Stop Upload
                </a>
                <a v-show="uploadComplete" @click.prevent="closeModal()" class="badge-link">
                    Done
                </a>
                <!-- <a class="badge-link" data-bs-dismiss="modal" v-on:click="upload()">Upload</a> -->
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import VueUploadComponent from 'vue-upload-component';
export default {
    name: "Uploader",
    components: { FileUpload : VueUploadComponent },
    data: function () {
        return {
            files: [],
            uploadModal : {},
            uploadComplete : false,
        }
    },
    created: function() {
        this.$nextTick(function () {
            var el = document.getElementById('UploadModal');
            this.uploadModal = new bootstrap.Modal(el, {
                keyboard: false
            });
            this.uploadComplete = false;
        });
        
    },
    beforeDestroy: function() {
        
    },
    updated: function() {
        
    },
    methods: {
        inputFile: function (newFile, oldFile) {
            if (newFile && oldFile && !newFile.active && oldFile.active) {
                if (newFile.xhr) console.log('response', newFile.xhr.status, newFile.response)    
                else console.log('response', newFile.response)
                this.uploadComplete = true;
                this.$root.refreshViews();
                this.$forceUpdate();
            }
            if(newFile != undefined && oldFile != undefined)
            {
                // Upload progress
                if (newFile.progress !== oldFile.progress) {
                    //console.log('progress', newFile.progress, newFile)
                }

                // Upload error
                if (newFile.error !== oldFile.error) {
                    //console.log('error', newFile.error, newFile)
                }

                // Uploaded successfully
                if (newFile.success !== oldFile.success) {
                    //console.log('success', newFile.success, newFile)
                }
            }
        },
        inputFilter: function (newFile, oldFile, prevent) {
            if (newFile && !oldFile) {
                // Filter non-image file
                if (/\.(DS_Store|git)$/i.test(newFile.name)) {
                    return prevent()
                }
            }
            // Create a blob field
            newFile.blob = ''
            let URL = window.URL || window.webkitURL
            if (URL && URL.createObjectURL) {
                newFile.blob = URL.createObjectURL(newFile.file)
            }
        },
        gettUrl: function() {
            var current_path = this.$store.getters.getLocationCurrent();
            var loc = this.$store.getters.getLocationPath(current_path);
            var path = "";
            if(loc == "/") path = loc;
            else if(loc.isFile) path += loc.folder;
            else path += current_path;
            return path;
        },
        closeModal: function() {
            this.uploadModal.hide();
            this.files = [];
            this.uploadComplete = false;
            this.$root.refreshViews();
            console.log("Closing file uploader");
        },
        getProgressBarWidth: function (fileData) {
            return `${fileData.error == '' ? fileData.progress : '100'}%`;
        },
    },
    computed: {
        
    }
}
</script>