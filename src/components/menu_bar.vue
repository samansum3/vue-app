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
                    <button v-if="!hideAddButton" class="btn btn-add shadow-none ml-4" @click="$emit('onCreate')">
                        <b-icon-plus-circle v-if="!hideAddButtonIcon" />
                        <span :class="addButtonTextClass">{{ addButtonText }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { debounce } from 'lodash';

export default {
    name: 'Menu bar',
    props: {
        pageTitle: {type: String, default: ''},
        addButtonText: {type: String, default: 'Add new'},
        addButtonTextClass: {type: String, default: ''},
        hideAddButtonIcon: {type: Boolean, default: false},
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
        search: debounce(function() {
            this.$emit('search-changed', this.keywords);
        }, 500)
    }
}
</script>