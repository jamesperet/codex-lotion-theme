<template>
    <footer v-if="user != undefined" class="footer mt-auto py-3" style="padding-left: 12px; padding-right: 12px padding-bottom: 8px;">
        <hr style="margin-left: -12px;">
        <div class="dropdown">
            <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                <img :src="user.picture" alt="" width="32" height="32" class="rounded-circle me-2">
                <strong>{{user.name}}</strong>
            </a>
            <ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                <!-- <li><a class="dropdown-item" href="#">New project...</a></li>
                <li><a class="dropdown-item" href="#">Settings</a></li>
                <li><a class="dropdown-item" href="#">Profile</a></li>
                <li><hr class="dropdown-divider"></li> -->
                <li>
                    <a v-on:click="logout()" class="dropdown-item" href="">
                        <i class="fas fa-sign-out-alt"></i> Sign out
                    </a>
                </li>
            </ul>
        </div>
    </footer>
</template>

<script>
export default {
    name: "User",
    data: function () {
        return {
            auth0 : undefined,
            user : undefined
        }
    },
    created: function() {
        console.log('Creating user');
        var vm = this;
        this.$store.dispatch('requestUserData')
        .then(() => {
            vm.user = vm.$store.getters.getUser();
            console.log(vm.user);
            vm.$forceUpdate();
        }).catch(err => { console.log(err)});
    },
    beforeDestroy: function() {
        
    },
    updated: function() {
        
    },
    methods: {
        logout: function(){
            this.$store.commit("setActivityMessage", { 
                id : 'loging-out', 
                text: `Loging out...`, 
                status: 'incomplete'
            } );
            var loc = window.location;
            window.location.href = `${loc.protocol}//${loc.host}/logout`;
        }
    }
}
</script>