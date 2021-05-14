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
import PostCard from './post_card';

import '../../css/components/post.scss';

export default {
    name: 'Post grid',
    props: {
        posts: { type: Array, default: () => ([]) }
    },
    components: {
        PostCard
    }
}
</script>