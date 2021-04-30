<template>
    <div class="user-wrapper mb-5">
        <div class="top-navigation">
            <div class="container-1280 d-flex">
                <div class="ml-auto d-flex nav-control">
                    <div class="search-box-wrapper">
                        <input type="text" v-model="keywords" placeholder="Search" class="form-control search-box max-width-215">
                        <b-icon-search />
                    </div>
                    <button v-if="isAdmin" class="btn btn-add shadow-none ml-4" @click="createUserAccount">
                        <b-icon-plus-circle />
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
                            <td>{{ user.role.name }}</td>
                            <td>{{ timestampToString(new Date(user.createDate).getTime()) }}</td>
                            <td v-if="isAdmin" class="text-right w-55">
                                <three-dot-dropdown
                                    :items="dropdownItems"
                                    @action="performAction($event, user)"
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
import axios from 'axios/dist/axios.min';
import DateFormater from '../mixins/date_format.es';
import CreateUserPopup from '../mixins/create_user_popup.es';
import ThreeDotDropdown from './three_dot_dropdown';
import DeleteConfirm from '../mixins/delete_confirm';

import '../css/components/user.scss';

const getUsers = (callback) => {
    axios.get('/api/user/get-all/').then(response => {
        if (response.data.success) {
            callback(vm => {
                vm.users = response.data.result
                vm.isAdmin = response.data.admin;
            });
        }
    }).catch(error => {
        console.error(error);
        callback();
    });
}

export default {
    name: 'User',
    mixins: [DateFormater, CreateUserPopup, DeleteConfirm],
    components: {
        ThreeDotDropdown
    },
    data() {
        return {
            columns: ['Name', 'Email', 'Role', 'Create Date'],
            isAdmin: false,
            users: [],
            keywords: '',
            dropdownItems: [
                {key: 'updateUser', value: 'Update'},
                {key: 'deleteUser', value: 'Delete'}
            ]
        }
    },
    computed: {
        checkAll: {
            set(checked) {
                this.filteredUser.forEach(user => user.checked = checked);
            },
            get() {
                const checkedUser = this.filteredUser.filter(user => user.checked).length;
                return this.filteredUser.length > 0 && this.filteredUser.length === checkedUser;
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
    beforeRouteEnter(to, from, next) {
        getUsers(next, to, from);
    },
    methods: {
        performAction(key, user) {
            this[key](user);
        },
        updateUser(user) {
            this.openCreateUserPopup(updatedUser => {
                const index = this.users.findIndex(u => u.uid === updatedUser.uid);
                if (index !== -1) {
                    this.users.splice(index, 1, updatedUser);
                }
            }, user);
        },
        deleteUser(user) {
            this.deleteConfirm({
                title: 'Are you sure you want to delete this user?',
                body: 'This user will no longer be able to login.',
                deleteUrl: '/api/user/delete',
                deleteOption: {
                    data: {
                        uid: user.uid
                    }
                }
            }, success => {
                if (success) {
                    const index = this.users.findIndex(u => u.uid === user.uid);
                    this.users.splice(index, 1);
                }
            });
        },
        createUserAccount() {
            this.openCreateUserPopup(user => this.users.push(user));
        }
    }
}
</script>