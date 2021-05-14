<template>
    <div class="post-view-wrapper container-1280 position-relative">
        <div class="row">
            <div class="col-12 col-lg-9">
                <template v-if="!isLoading">
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
                </template>
            </div>
            <div class="col-3 d-none d-lg-block mt-4 pt-1">
                <h4 class="related-post-title">
                    Latest Post
                </h4>
                <hr />
                <div class="related-post-wrapper">
                    <post-card
                        v-for="(post, index) in latestPosts"
                        :key="'post-' + index"
                        :post="post"
                        :is-latest-post="true"
                    ></post-card>
                </div>
            </div>
        </div>
        <loading-indicator :is-loading="isLoading" />
    </div>
</template>

<script>
import axios from 'axios/dist/axios.min';
import LoadingIndicator from '../loading_indicator';
import PostCard from './post_card';

import '../../css/components/post_view.scss';
import '../../css/components/post.scss';

export default {
    name: 'Post view',
    components: {
        LoadingIndicator,
        PostCard
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
    beforeRouteEnter: function(to, from, next) {
        next(vm => {
            vm.getPost(to.query.id);
            vm.getLatestPosts();
        });
    },
    beforeRouteUpdate: function(to, from, next) {
        this.getPost(to.query.id);
        next();
    },
    methods: {
        getPost(uid) {
            this.isLoading = true;
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
            axios.get('/api/post/get-latest').then(response => {
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