<template>
  <div id="app">
    <div v-if="isLoading">
      <h3>Loading...</h3>
    </div>
    <template v-else>
      <login v-if="!isSignedIn" />
      <template v-else>
        <navbar></navbar>
          <p>
            <!-- use router-link component for navigation. -->
            <!-- specify the link by passing the `to` prop. -->
            <!-- `<router-link>` will be rendered as an `<a>` tag by default -->
            <router-link to="/foo">Go to Foo</router-link>
            <router-link to="/bar">Go to Bar</router-link>
          </p>
        <router-view></router-view>

        <button class="btn btn-info" @click="logout">Log out</button>
        <div>Hello world</div>
        <button class="btn btn-primary" @click="getAllInvoices">Get Incoices</button>
      </template>
    </template>
  </div>
</template>

<script>
  import firebase from 'firebase/app';
  import axios from 'axios/dist/axios.min';
  
  import login from './components/login';
  import Navbar from './components/navbar';

  export default {
    name: 'App',
    components: {
      login,
      Navbar
    },
    data() {
      return {
        isSignedIn: false,
        isLoading: false
      }
    },
    created() {
      this.isLoading = true;
      firebase.auth().onAuthStateChanged(auth => {
        this.isLoading = false;
        if (auth) {
          if (!auth.emailVerified) {
            auth.sendEmailVerification().then(() => {
              alert('Your email is not verified! Please check your inbox and verify.');
            });
          }
        }
        this.isSignedIn = !!auth;
      });
    },
    methods: {
      getAllInvoices() {
        const user = firebase.auth().currentUser;
        if (!user) {
          return;
        }
        user.getIdToken(false).then(token => {
          axios.get('/invoice/get-all/', {
            headers: {
              token: token
            }
          }).then(response => console.log(response.data)).catch(console.error);
        }).catch(console.error);
      },
      logout() {
        firebase.auth().signOut();
      }
    }
  }
</script>
