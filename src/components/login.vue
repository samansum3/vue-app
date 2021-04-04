<template>
    <div>
        <input type="text" class="form-control" placeholder="Enter email" v-model="user.email" />
        <input type="text" class="form-control" placeholder="Enter password" v-model="user.password" />
        <button class="btn btn-primary" @click="login">Login</button>
    </div>
</template>

<script>
import firebase from 'firebase';    //Not secure yet

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
        }
    }
}
</script>
