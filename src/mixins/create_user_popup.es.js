import Dialog from './dialog.es';
import { required, email, minLength } from 'vuelidate/dist/validators.min';
import axios from 'axios/dist/axios.min';
import Dropdown from '../components/dropdown.vue';

const CreateUserPopup = {
    mixins: [Dialog],
    methods: {
        openCreateUserPopup(callback = () => {}) {
            this.openDialog({
                vue: {
                    components: {
                      Dropdown
                    },
                    data() {
                        return {
                            roles: [],
                            user: {
                                firstName: '',
                                lastName: '',
                                emailAddress: '',
                                password: '',
                                confirmPassword: '',
                                role: 0
                            },
                            notMatchPassword: false
                        }
                    },
                    validations: {
                        user: {
                            firstName: { required },
                            lastName: { required },
                            emailAddress: { required, email },
                            password: { required, minLength: minLength(6) },
                            confirmPassword: { required },
                            role: { required }
                        }
                    },
                    computed: {
                        invalidFirstName() {
                            return this.$v.user.firstName.$error;
                        },
                        invalidLastName() {
                            return this.$v.user.lastName.$error;
                        },
                        invalidEmail() {
                            return this.$v.user.emailAddress.$error;
                        },
                        invalidPassword() {
                            return this.$v.user.password.$error;
                        },
                        invalidConfirmPassword() {
                            return this.$v.user.confirmPassword.$error || (this.notMatchPassword && this.user.password !== this.user.confirmPassword);
                        },
                        confirmPassowrdErrorMessage() {
                            return 'Password don\'t match';
                        }
                    },
                    created() {
                        this.getRoles();
                    },
                    methods: {
                        getRoles() {
                            this.isLoading = true;
                            axios.get('/api/role/get').then(response => {
                                this.isLoading = false;
                                if (response.data.success) {
                                    this.roles = response.data.data;
                                }
                            }).catch(error => {
                                this.isLoading = false;
                                console.error(error);
                            });
                        },
                        createUserAccount() {
                            this.$v.user.$touch();
                            if (this.user.password !== this.user.confirmPassword) {
                                this.notMatchPassword = true;
                                return;
                            }
                            if (this.$v.$error) {
                                return;
                            }

                            axios.post('/api/user/create/', this.user).then(response => {
                                if (response.data.success) {
                                    callback(response.data.result);
                                    this.dialog.close();
                                }
                            }).catch(console.error);
                        }
                    }
                },
                dialog: {
                    title: 'Create user'.toUpperCase(),
                    width: '600px',
                    showClass: {
                        popup: ''
                    },
                    content: `
                        <div class="container pt-4">
                            <div calss="form-body">
                                <div class="row group-control">
                                    <div class="col-2">
                                        <label>Name</label>
                                    </div>
                                    <div class="col-5">
                                        <input type="text" placeholder="First name" class="form-control" v-model="user.firstName" />
                                        <span class="error-message" v-if="invalidFirstName">Please input your first name</span>
                                    </div>
                                    <div class="col-5">
                                        <input type="text" placeholder="Last name" class="form-control" v-model="user.lastName" />
                                        <span class="error-message" v-if="invalidLastName">Please input your last name</span>
                                    </div>
                                </div>
                                <div class="row group-control">
                                    <div class="col-2">
                                        <label>Email</label>
                                    </div>
                                    <div class="col-10">
                                        <input type="text" placeholder="Email address" class="form-control" v-model="user.emailAddress" autocomplete="off" />
                                        <span class="error-message" v-if="invalidEmail">Please input a valid email address</span>
                                    </div>
                                </div>
                                <div class="row group-control">
                                    <div class="col-2">
                                        <label>Password</label>
                                    </div>
                                    <div class="col-5">
                                        <input type="password" placeholder="Password" class="form-control" v-model="user.password" autocomplete="off" />
                                        <span class="error-message" v-if="invalidPassword">Please input at least 6 characters</span>
                                    </div>
                                    <div class="col-5">
                                        <input type="password" placeholder="Confirm password" class="form-control" v-model="user.confirmPassword" autocomplete="off" />
                                        <span class="error-message" v-if="invalidConfirmPassword">{{ confirmPassowrdErrorMessage }}</span>
                                    </div>
                                </div>
                                <div class="row group-control">
                                    <div class="col-2">
                                        <label>Role</label>
                                    </div>
                                    <div class="col-10">
                                        <dropdown
                                            placeholder="Select Role"
                                            value="user.role"
                                            :items="roles"
                                            @change="user.role = $event"
                                        ></dropdown>
                                        <span class="error-message" v-if="$v.user.role.$error">Role is required</span>
                                    </div>
                                </div>
                            </div>
                            <div class="popup-footer">
                                <button class="btn btn-outline-primary mr-3" @click="dialog.close()">Cancel</button>
                                <button class="btn btn-primary" @click="createUserAccount">Create</button>
                            </div>
                        </div>
                    `
                }
            });

        }
    }
}

export default CreateUserPopup;