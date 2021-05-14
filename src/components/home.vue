<template>
    <div class="home-page-content">
        <menu-bar :hide-add-button="true" @search-changed="searchPost"></menu-bar>
        <post-grid :posts="filteredPosts"></post-grid>
        <!-- todo add loading icon -->
    </div>
</template>

<script>
import axios from 'axios/dist/axios.min';
import MenuBar from './menu_bar';
import PostGrid from './post/post_grid';

import '../css/components/home.scss';

export default {
    name: 'Home',
    components: {
        MenuBar,
        PostGrid
    },
    data() {
        return {
            posts: [],
            keywords: '',
            isLoading: false
        }
    },
    created() {
        this.getPost();
    },
    computed: {
        filteredPosts: function() {
            //TODO search from backend instead
            const text = this.keywords.toLowerCase();
            return this.posts.filter(post => {
                return post.title.toLowerCase().includes(text) || post.description.toLowerCase().includes(text);
            });
        }
    },
    methods: {
        searchPost(keywords) {
            this.keywords = keywords;
        },
        getPost() {
            this.isLoading = true;
            axios.get('/api/post/get-small').then(response => {
                this.isLoading = false;
                if (response.data.success) {
                    //TODO Support infinit scroll
                    this.posts = this.posts.concat(response.data.result);
                }
            }).catch(error => {
                this.isLoading = false;
                console.log(error);
            });
        }
    }
}
</script>