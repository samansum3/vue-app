<template>
    <div class="d-flex align-items-center justify-content-center">
         <div class="longin-wrapper">
            <div class="form-wrapper">
                <template v-if="isLogin">
                    <div class="avatar">
                        <img src="../../public/avatar.png" alt="avatar">
                    </div>
                    <form @submit.prevent="login">
                        <div v-if="loginFailed" class="text-warning pb-2">Wrong email or password</div>
                        <div class="group-control">
                            <input type="text" class="form-control" placeholder="Login" v-model="user.email" />
                            <span class="error-message" v-if="isInvalidEmail">Please input a valid email address</span>
                        </div>
                        <div class="group-control">
                            <input type="password" class="form-control" placeholder="Password" v-model="user.password" />
                            <span class="error-message" v-if="isEmptyPassword">Please enter password</span>
                        </div>
                        <button
                            class="btn btn-login"
                            type="submit"
                            :class="{'disabled': disableButtonLogin}"
                            :disabled="disableButtonLogin"
                        >
                            <spinner v-if="isLoading" css-class="top-13"></spinner>
                            <span>Login</span>
                        </button>
                    </form>
                </template>
                <div v-else class="reset-password">
                    <h3>Reset password</h3>
                    <hr />
                    <p>{{ resetPasswordDescription }}</p>
                    <form v-if="!isSent" @submit.prevent="sendResetPasswordEmail">
                        <div class="group-control">
                            <input type="text" class="form-control" placeholder="Email address" v-model="user.email" />
                            <span class="error-message" v-if="isInvalidEmail">Please input a valid email address</span>
                        </div>
                        <button
                            class="btn btn-login"
                            type="submit"
                            :class="{'disabled': isInvalidEmail}"
                            :disabled="isInvalidEmail"
                        >
                            <spinner v-if="isLoading" css-class="top-13"></spinner>
                            <span>Send</span>
                        </button>
                    </form>
                </div>
            </div>
            <div class="forget-password-wrapper d-flex justify-content-center">
                <span class="forget-password" @click="switchForm">{{ footerLinkText }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import { required, email } from 'vuelidate/dist/validators.min';
import axios from 'axios/dist/axios.min';

export default {
    name: 'Login',
    data() {
        return {
            user: {
                email: '',
                password: ''
            },
            isLogin: true,
            isSent: false,
            loginFailed: false,
            isLoading: false
        }
    },
    computed: {
        footerLinkText() {
            return this.isLogin ? 'Forget passowrd' : 'Login';
        },
        resetPasswordDescription() {
            return !this.isSent ? 'By clicking send you\'ll get a reset password email.' : 'We have sent you a reset password link. Please check your email.';
        },
        isInvalidEmail() {
            return this.$v.user.email.$error;
        },
        isEmptyPassword() {
            return this.$v.user.password.$error;
        },
        isInvalidInfo() {
            return this.isInvalidEmail || this.isEmptyPassword;
        },
        disableButtonLogin() {
            return this.isInvalidInfo || this.isLoading;
        }
    },
    validations: {
        user: {
            email: { required, email },
            password: { required }
        }
    },
    methods: {
        login() {
            this.validate();
            if (this.isInvalidInfo) {
                return;
            }
            this.isLoading = true;
            firebase.auth().signInWithEmailAndPassword(this.user.email, this.user.password).then(auth => {
                this.loginFailed = false;
                auth.user.getIdToken().then(idToken => {
                    firebase.auth().signOut();
                    
                    axios.post('/session_login/', {
                        idToken
                    }).then(() => {
                        this.$router.push('/');
                    }).catch(error => {
                        this.isLoading = false;
                        console.error(error);
                    });
                });
            }).catch(() => {
                this.loginFailed = true;
                this.isLoading = false;
            });
        },
        sendResetPasswordEmail() {
            this.$v.user.email.$touch();
            if (this.isInvalidEmail) {
                return;
            }
            this.isLoading = true;
            firebase.auth().sendPasswordResetEmail(this.user.email).then(() => {
                this.isSent = true;
                this.isLoading = false;
            }).catch(error => {
                this.isLoading = false;
                console.error(error);
            });
        },
        switchForm() {
            this.isLogin = !this.isLogin;
            this.$v.user.$reset();
        },
        validate() {
            this.$v.user.email.$touch();
            this.$v.user.password.$touch();
        }
    }
}
</script>
