<template>
    <div class="post-view-wrapper container-1280 position-relative">
        <div v-if="!isLoading" class="row">
            <div class="col-12 col-lg-9">
                <div class="author-info">
                    <img :src="post.author.avatar" alt="Author avatar" />
                    <div class="author-name-wrapper">
                        <div class="author-name">{{ post.author.name }}</div>
                        <span class="create-date">{{timestampToString(post.createDate, 'DD MMM yyyy @hh:mm A') }}</span>
                    </div>
                </div>
                <hr />

                <div class="banner-image-wrapper">
                    <img :src="post.featureImage" alt="Feature Image" />
                </div>
                <div class="d-flex">
                    <div class="post-body">
                        <div class="title">
                            <h4>{{ post.title }}</h4>
                        </div>
                        <div class="description">
                            <p>{{ post.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-3 d-none d-lg-block">
                <h4 class="related-post-title">
                    Latest Post
                </h4>
                <hr />
                <div class="related-post-wrapper">
                    <!-- Post card -->
                </div>
            </div>
        </div>
        <loading-indicator :is-loading="isLoading" />
    </div>
</template>

<script>
import axios from 'axios/dist/axios.min';
import LoadingIndicator from '../loading_indicator';

import '../../css/components/post_view.scss';

export default {
    name: 'Post view',
    components: {
        LoadingIndicator
    },
    data() {
        return {
            post: {
                author: {}
            },
            latestPosts: [],
            isLoading: true
        }
    },
    created() {
        this.getPost();
    },
    methods: {
        getPost() {
            this.isLoading = true;
            
            const uid = this.$route.query.id;
            if (!uid) {
                this.redirectToPageNotFound()
                return;
            }

            axios.get('/api/post/post_view', {
                params: {
                    uid: uid
                }
            }).then(response => {
                this.isLoading = false;
                if (response.data.success) {
                    this.post = response.data.result;
                }
            }).catch(error => {
                this.isLoading = false;
                console.error(error);
                this.redirectToPageNotFound();
            });
        },
        getLatestPosts() {
            axios.get('/api/post/latest').then(response => {
                if (response.data.success) {
                    this.latestPosts = response.data.result;
                }
            }).catch(console.error);
        },
        redirectToPageNotFound() {
            this.$router.push('/page-not-found');
        }
    }
}
</script>