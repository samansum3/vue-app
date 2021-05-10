<template>
    <div class="post-card-wrapper">
        <div class="image-wrapper" @click="redirect">
            <img :src="post.featureImage" alt="Feature image" class="feature-image" />
            <div class="create-date">
                <span>{{ timestampToString(post.createDate) }}</span>
            </div>
        </div>
        <div class="post-title">
            <h5>{{ post.title }}</h5>
        </div>
        <div class="description">
            <p class="text-ellipsis-4">{{ post.description }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Post card',
    props: {
        post: {type: Object, require: true}
    },
    methods: {
        redirect() {
            console.log('View post');
            //TODO remove this method and use <router-link tag="h5"> instead
        }
    }
}
</script>