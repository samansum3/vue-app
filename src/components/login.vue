<template>
    <form @submit.prevent="login">
        <input type="text" class="form-control" placeholder="Enter email" v-model="user.email" />
        <input type="text" class="form-control" placeholder="Enter password" v-model="user.password" />
        <button class="btn btn-primary" type="submit">Login</button>
        <button class="btn btn-primary" @click="signup">Sign up</button>
    </form>
</template>

<script>
import firebase from 'firebase/app';

export default {
    name: 'Login',
    data() {
        return {
            user: {
                email: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            firebase.auth().signInWithEmailAndPassword(this.user.email, this.user.password).then(auth => {
                console.log(auth);
            }).catch(console.error);
        },
        signup() {
            firebase.auth().createUserWithEmailAndPassword(this.user.email, this.user.password).then(console.log).catch(console.error);
        }
    }
}
</script>
