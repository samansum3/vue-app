<template>
    <manager-page
        page-title="Manage Post"
        :items="posts"
        :columns="columns"
        :search-by="searchBy"
        addButtonText="New post"
        @add-new="addNewPost"
        @trigger-three-dot="triggerThreeDot"
    ></manager-page>
</template>

<script>
import axios from 'axios/dist/axios.min';
import DateFormater from '../mixins/date_format.es';
import ManagerPage from './manager_page';
import DeleteConfirm from '../mixins/delete_confirm';
import CratePost from '../mixins/create_post';

const getPosts = (next) => {
    axios.get('/api/post/get-all/').then(response => {
        next(vm => {
            if (response.data.success) {
                vm.posts = response.data.result.map(post => {
                    vm.qulaifyPost(post);
                    return post;
                });
            }
        });
    }).catch(error => {
        console.error(error);
        next();
    });
}

export default {
    name: 'Manage Post',
    mixins: [ DateFormater, DeleteConfirm, CratePost],
    components: {
        ManagerPage
    },
    data() {
        return {
            posts: [],
            columns: [
                {
                    name: 'Title',
                    getData: item => item.title,
                    sortable: false
                },
                {
                    name: 'Author',
                    getData: item => item.author,
                    sortable: false
                },
                {
                    name: 'Cteate Date',
                    getData: item => this.timestampToString(new Date(item.createDate).getTime()),
                    sortable: false
                }
            ],
            threeDotItems: [
                {
                    key: 'viewPost',
                    value: 'View'
                },
                {
                    key: 'updatePost',
                    value: 'Update',
                    permission: 'updatable'
                },
                {
                    key: 'deletePost',
                    value: 'Delete',
                    permission: 'deletable'
                }
            ],
            searchBy: ['title']
        }
    },
    beforeRouteEnter(to, from, next) {
        getPosts(next, to, from);
    },
    methods: {
        triggerThreeDot(key, post) {
            this[key](post);
        },
        addNewPost() {
            this.openCreatePostPopup(post => this.posts.push(this.qulaifyPost(post)));
        },
        viewPost(post) {
            //TODO redirect to view post screen
            console.log('view post ' + JSON.stringify(post));
        },
        updatePost(post) {
            this.openCreatePostPopup((updatedPost) => {
                updatedPost.updatable = post.updatable;
                updatedPost.deletable = post.deletable;
                updatedPost.checked = post.checked;
                updatedPost.createDate = post.createDate;
                updatedPost.author = post.author;
                const index = this.posts.findIndex(p => p.uid == updatedPost.uid);
                if (index > -1) {
                    this.posts.splice(index, 1, this.qulaifyPost(updatedPost));
                }
            }, post);
        },
        deletePost(post) {
            this.deleteConfirm({
                title: 'Are you sure you want to delete this post?',
                body: 'Please be certain, there is no going back.',
                deleteUrl: '/api/post/delete',
                deleteOption: {
                    data: {
                        uid: post.uid
                    }
                }
            }, success => {
                if (success) {
                    const index = this.posts.findIndex(p => p.uid === post.uid);
                    if (index > -1) {
                        this.posts.splice(index, 1);
                    }
                }
            });
        },
        qulaifyPost(post) {
            post.threeDotItems = [];
            this.threeDotItems.forEach(item => {
                if (!item.permission || post[item.permission]) {
                    post.threeDotItems.push(item);
                }
            });
            post.checked = post.checked || false;
            return post;
        }
    }
}
</script>