<template>
    <nav class="global-navigation navbar navbar-expand-lg navbar-light bg-light">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <router-link to="/" class="navbar-brand">App</router-link>

        <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
            <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                <li v-for="(item, index) in navbarItems" :key="'item-' + index" class="nav-item" :class="{'active': $route.name == item.route.name}">
                    <router-link :to="item.route.path" class="nav-link text-uppercase">{{ item.value }}</router-link>
                </li>
            </ul>
            <form class="form-inline my-2 my-lg-0">
                <user-avatar />
            </form>
        </div>
    </nav>
</template>

<script>
import UserAvatar from './user_avatar';

export default {
    name: 'Navbar',
    components: {
        UserAvatar
    },
    data() {
        return {
            navbarItems: [
                {
                    value: 'Invoice',
                    key: 'invoice',
                    route: {
                        path: '/foo',
                        name: 'Foo'
                    }
                },
                {
                    value: 'User',
                    key: 'user',
                    route: {
                        path: '/user',
                        name: 'User'
                    }
                }
            ]
        }
    },
    methods: {

    }
};
</script>
