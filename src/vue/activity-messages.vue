<template>
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 11">

        <div v-for="(msg, index) in messages" :key="index" class="toast show" role="alert" 
            aria-live="assertive" aria-atomic="true" style="background-color: rgb(55, 60, 63);"
            :class="getBgTag(msg.status)">
            <div class="d-flex text-white">
                <div class="toast-body text-break">
                    <div v-show="msg.status == 'incomplete'" class="spinner-border spinner-border-sm" role="status">
                        <span class="visually-hidden"></span>
                    </div>
                    <i v-show="msg.status == 'error'" class="fas fa-exclamation-circle"></i>
                    <i v-show="msg.status == 'success'" class="fas fa-check-circle"></i>
                    <span style="padding-left: 8px; vertical-align: text-top;">
                        {{msg.text}}
                    </span>
                    <div v-show="msg.error != undefined" class="mt-2 pt-2 border-top">
                        <small>{{msg.error}}</small>
                    </div>
                </div>
                <a class="me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"
                style="padding-right: 8px; cursor: pointer;" v-on:click="removeMessage(msg)">
                    <i class="fas fa-times"></i>
                </a>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: "ActivityMessages",
    data: function () {
        return {
            messages : [
                // {
                //     id: 'save-index-md',
                //     status: 'incomplete',
                //     text: 'Saving file \'index.md\'',
                //     autohide : false
                // },
            ],
            checkForMessages : undefined
        }
    },
    created: function() {
        this.$root.$on('update-activity-messages', this.getMessages);
    },
    beforeDestroy: function() {
        this.$root.$off('update-activity-messages', this.getMessages);
    },
    updated: function() {
        
    },
    methods: {
        getMessages: function(){
            var new_messages = this.$store.getters.getActivityMessages();
            for (let i = 0; i < new_messages.length; i++) {
                var new_msg = new_messages[i];
                var found = false;
                for (let a = 0; a < this.messages.length; a++) {
                    var msg = this.messages[a];
                    //console.log(`${new_msg.id} == ${msg.id} (${new_msg.id == msg.id})`);
                    if(new_msg.id == msg.id) {
                        // msg already in list
                        found = true;
                        //console.log(`Updating message`, new_msg);
                        if(new_msg.status == 'success' && msg.autohide != true) {
                            msg = new_msg; 
                            msg.autohide = true;
                            this.removeAfterDelay(msg);
                        } else {
                            msg = new_msg; 
                        }
                        this.messages[a] = msg;
                        this.$forceUpdate();
                    }
                }
                if(found == false){
                    // Message not in list
                    if(new_msg.status == 'success') {
                        new_msg.autohide = true;
                        this.removeAfterDelay(new_msg);
                    }
                    this.messages.push(new_msg);
                    //console.log(`Adding message`, new_msg);
                }
            }
        },
        getBgTag: function(status){
            switch (status) {
                case 'success':
                    return 'bg-success';
                case 'error':
                    return 'bg-danger';
                default:
                    return '';
            }
        },
        removeMessage: function(msg){
            var index = this.messages.findIndex(e => e.id === msg.id);
            this.messages.splice(index, 1);
            this.$store.commit("removeActivityMessage", msg);
        },
        removeAfterDelay: function(msg){
            var vm = this;
            setTimeout(() => {
                vm.removeMessage(msg);
                vm.$forceUpdate();
            }, 2500);
        }
    }
}
</script>