<template>
    <div class="manager-page-wrapper mb-5">
        <div class="top-navigation">
            <div class="container-1280 d-flex h-100">
                <div v-if="pageTitle" class="d-flex align-items-center">
                    <span class="font-weight-bold color-black">{{ pageTitle }}</span>
                </div>
                <div class="ml-auto d-flex align-items-center nav-control">
                    <div v-if="!hideSearchBox" class="search-box-wrapper">
                        <input type="text" v-model="keywords" :placeholder="searchPlaceholder" @keyup="search" class="form-control search-box max-width-215">
                        <b-icon-search />
                    </div>
                    <button v-if="!hideAddButton" class="btn btn-add shadow-none ml-4" @click="onCreate">
                        <b-icon-plus-circle />
                        <span>{{ addButtonText }}</span>
                    </button>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
export default {
    name: 'Menu bar',
    props: {
        pageTitle: {type: String, default: ''},
        addButtonText: {type: String, default: 'Add new'},
        hideAddButton: {type: Boolean, default: false},
        searchPlaceholder: {type: String, default: 'Search'},
        hideSearchBox: {type: Boolean, default: false},

    },
    data() {
        return {
            keywords: '',
        }
    },
    methods: {
        search() {
            this.$emit('search-changed', this.keywords);
        }
    }
}
</script>