<template>
    <div class="user-wrapper">
        <div class="top-navigation">
            <div class="container-1280 d-flex">
                <div class="ml-auto d-flex nav-control">
                    <div class="mr-4">
                        <input type="text" v-model="keywords" placeholder="Search" class="form-control search-box shadow-none">
                    </div>
                    <button class="btn btn-add shadow-none" @click="createUserAccount">
                        <span>Add User</span>
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
                            <th v-for="(column, index) in columns" :key="index" scope="col">{{ column }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(user, index) in filteredUser" :key="'user-' + index">
                            <td scope="col" class="table-checkbox">
                                <input type="checkbox" v-model="user.checked">
                            </td>
                            <td>{{ user.firstName + ' ' + user.lastName }}</td>
                            <td>{{ user.emailAddress }}</td>
                            <td>{{ user.roles }}</td>
                            <td>{{ timestampToString(new Date(user.createDate).getTime()) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios/dist/axios.min';
import DateFormater from '../mixins/date_format.es';
import CreateUserPopup from '../mixins/create_user_popup.es';

export default {
    name: 'User',
    mixins: [DateFormater, CreateUserPopup],
    data() {
        return {
            columns: ['Name', 'Email', 'Role', 'Create Date'],
            isLoading: false,
            users: [],
            keywords: ''
        }
    },
    computed: {
        checkAll: {
            set(checked) {
                this.users.forEach(user => user.checked = checked);
            },
            get() {
                const checkedUser = this.users.filter(user => user.checked).length;
                return this.users.length > 0 && this.users.length === checkedUser;
            }
        },
        filteredUser() {
            return this.users.filter(user => {
                if (!this.keywords) return true;
                let search = this.keywords.toLowerCase();
                return (user.firstName || '').toLowerCase().includes(search) ||
                    (user.lastName || '').includes(search) ||
                    (user.emailAddress || '').toLowerCase().includes(search);
            });
        }
    },
    created() {
        this.getUsers();
    },
    methods: {
        getUsers() {
            axios.get('/api/user/get-all/').then(response => {
                this.isLoading = false;
                if (response.data.success) {
                    this.users = response.data.result;
                }
            }).catch(error => {
                console.error(error);
                this.isLoading = false;
            });
        },
        createUserAccount() {
            this.openCreateUserPopup(() => {
                console.log('Created a user');
            });
        }
    }
}
</script>