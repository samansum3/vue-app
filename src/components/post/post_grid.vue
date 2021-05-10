<template>
    <div class="post-grid-wrapper">
        <div class="card-container container-1280">
            <div class="row">
                <div v-for="(post, index) in posts" :key="'post-' + index" class="col-12 col-sm-6 col-md-6 col-lg-4">
                    <post-card :post="post"></post-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios/dist/axios.min';
import PostCard from './post_card';

import '../../css/components/post.scss';

export default {
    name: 'Post grid',
    components: {
        PostCard
    },
    data() {
        return {
            posts: [],
            isLoading: false,
        }
    },
    created() {
        this.getPost();
    },
    methods: {
        getPost() {
            this.isLoading = true;
            axios.get('/api/post/get-small').then(response => {
                this.isLoading = false;
                if (response.data.success) {
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