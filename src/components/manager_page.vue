<template>
    <div class="manager-page-wrapper mb-5">
        <div class="top-navigation">
            <div class="container-1280 d-flex h-100">
                <div v-if="pageTitle" class="d-flex align-items-center">
                    <span class="font-weight-bold color-black">{{ pageTitle }}</span>
                </div>
                <div class="ml-auto d-flex align-items-center nav-control">
                    <div v-if="searchBy.length" class="search-box-wrapper">
                        <input type="text" v-model="keywords" :placeholder="searchPlaceholder" class="form-control search-box max-width-215">
                        <b-icon-search />
                    </div>
                    <button class="btn btn-add shadow-none ml-4" @click="onCreate">
                        <b-icon-plus-circle />
                        <span>{{ addButtonText }}</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="card-container container-1280">
            <div class="candy-card">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col" class="table-checkbox">
                                <input type="checkbox" v-model="checkAll">
                            </th>
                            <th v-for="(column, index) in columns" :key="column.name + index" scope="col">{{ column.name }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in filteredItems" :key="'item-' + index">
                            <td scope="col" class="table-checkbox">
                                <input type="checkbox" v-model="item.checked">
                            </td>
                            <td v-for="(column, index) in columns" :key="'column-' + index">{{ column.getData(item) }}</td>
                            <td v-if="item.threeDotItems && item.threeDotItems.length" class="text-right w-55">
                                <three-dot-dropdown
                                    :items="item.threeDotItems"
                                    @action="performThreeDotAction($event, item)"
                                ></three-dot-dropdown>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import ThreeDotDropdown from './three_dot_dropdown';

export default {
    name: 'Manager page',
    components: {
        ThreeDotDropdown
    },
    props: {
        pageTitle: {type: String},
        addButtonText: {type: String},
        searchPlaceholder: {type: String, default: 'Search'},
        searchBy: {type: Array, default: () => ([])},
        columns: {type: Array, require: true},
        items: {type: Array, default: () => ([])}
    },
    data() {
        return {
            keywords: ''
        }
    },
    computed: {
        checkAll: {
            set(checked) {
                this.filteredItems.forEach(item => item.checked = checked);
            },
            get() {
                const checkedCount = this.filteredItems.filter(item => item.checked).length;
                return this.filteredItems.length > 0 && this.filteredItems.length === checkedCount;
            }
        },
        filteredItems() {
            return this.items.filter(item => {
                if (!this.keywords || !this.searchBy.length) return true;
                let search = this.keywords.toLowerCase();
                for (let field of this.searchBy) {
                    if ((item[field] || '').toLowerCase().includes(search)) {
                        return true;
                    }
                }
                return false;
            });
        }
    },
    methods: {
        onCreate() {
            this.$emit('add-new');
        },
        performThreeDotAction(key, item) {
            this.$emit('trigger-three-dot', key, item);
        }
    }
}
</script>