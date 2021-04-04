<template>
  <div id="app">
    <div v-if="isLoading">
      <h3>Loading...</h3>
    </div>
    <template v-else>
      <login v-if="!isSignedIn" />
      <div v-else>
        <button class="btn btn-info" @click="logout">Log out</button>
        <div>Hello world</div>
      </div>
    </template>
  </div>
</template>

<script>
  import login from './components/login';
  import firebase from 'firebase/app';

  export default {
    name: 'App',
    components: {
      login
    },
    data() {
      return {
        isSignedIn: false,
        isLoading: false
      }
    },
    created() {
      this.isLoading = true;
      firebase.auth().onAuthStateChanged(user => {
        this.isLoading = false;
        this.isSignedIn = !!user;
      });
    },
    methods: {
      logout() {
        firebase.auth().signOut();
      }
    }
  }
</script>
