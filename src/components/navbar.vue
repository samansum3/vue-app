<template>
    <nav class="global-navigation navbar navbar-expand-lg navbar-light bg-light">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <router-link to="/" class="navbar-brand">App</router-link>

        <div class="collapse navbar-collapse">
            <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                <li v-for="(item, index) in navbarItems" :key="'item-' + index" class="nav-item" :class="{'active': selectedNav == item.key}">
                    <a class="nav-link text-uppercase" href="javascript:;" @click="selectedNav = item.key">{{ item.value }}<span class="sr-only">(current)</span></a>
                </li>
            </ul>
            <form class="form-inline my-2 my-lg-0">
                <img src="../../public/saman.jpeg" class="user-avatar" alt="user-avatar">
            </form>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'Navbar',
    data() {
        return {
            selectedNav: 'invoice',
            navbarItems: [
                {
                    value: 'Invoice',
                    key: 'invoice'
                },
                {
                    value: 'User',
                    key: 'user'
                }
            ]
        }
    },
    methods: {

    }
};
</script>
