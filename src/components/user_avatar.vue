<template>
    <div class="dropdown-wrapper">
        <img
            id="user-profile-icon"
            src="../../public/saman.jpeg"
            class="user-avatar dropdown-toggle"
            alt="user-avatar"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
        >
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="user-profile-icon">
            <div v-for="(item, index) in items" :key="index">
                <a class="dropdown-item unselectable px-3 text-right" @click="performAction(item)">{{ item.value }}</a>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios/dist/axios.min';

export default {
    name: "UserAvatar",
    data() {
        return {
            items: [
                { key: 'myProfile', value: 'My profile' },
                { key: 'logout', value: 'Log out' }
            ]
        }
    },
    methods: {
        performAction(item) {
            this[item.key]();
        },
        myProfile: function() {
            this.$router.push('/my-profile').catch(() => {});
        },
        logout() {
            axios.post('/session_logout').then(response => {
                if (response.data.success) {
                    this.$router.push('/login');
                }
            }).catch(console.error);
        }
    }
}
</script>