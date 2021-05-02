<template>
    <manager-page
        page-title="Manage User"
        :items="users"
        :columns="columns"
        :search-by="searchBy"
        addButtonText="Add user"
        @add-new="createUserAccount"
        @trigger-three-dot="performAction"
    ></manager-page>
</template>

<script>
import axios from 'axios/dist/axios.min';
import DateFormater from '../mixins/date_format.es';
import CreateUserPopup from '../mixins/create_user_popup.es';
import DeleteConfirm from '../mixins/delete_confirm';
import ManagerPage from './manager_page';

const getUsers = (callback) => {
    axios.get('/api/user/get-all/').then(response => {
        if (response.data.success) {
            callback(vm => {
                vm.users = response.data.result.map(user => {
                    user.threeDotItems = vm.dropdownItems;
                    return user;
                });
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
        ManagerPage
    },
    data() {
        return {
            users: [],
            keywords: '',
            searchBy: ['firstName', 'lastName', 'emailAddress'],
            columns: [
                {
                    name: 'Name',
                    getData: item => item.firstName + ' ' + item.lastName
                },
                {
                    name: 'Email',
                    getData: item => item.emailAddress
                },
                {
                    name: 'Role',
                    getData: item => item.role.name
                },
                {
                    name: 'Create Date',
                    getData: item => this.timestampToString(new Date(item.createDate).getTime())
                }
            ],
            dropdownItems: [
                {key: 'updateUser', value: 'Update'},
                {key: 'deleteUser', value: 'Delete'}
            ]
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
            this.openCreateUserPopup(user => {
                user.threeDotItems = this.dropdownItems;
                this.users.push(user);
            });
        }
    }
}
</script>