<template>
  <div id="app">
    <div v-if="isLoading">
      <h3>Loading...</h3>
    </div>
    <template v-else>
      <navbar v-if="$route.name !== 'Login'"></navbar>
      <router-view></router-view>
      <button class="btn btn-info" @click="logout">Log out</button>
    </template>
  </div>
</template>

<script>
  import axios from 'axios/dist/axios.min';
  
  import Navbar from './components/navbar';

  export default {
    name: 'App',
    components: {
      Navbar
    },
    data() {
      return {
        isLoading: false
      }
    },
    methods: {
      getAllInvoices() {
        axios.get('/invoice/get-all/').then(response => console.log(response.data)).catch(console.error);
      },
      logout() {
        axios.post('/session_logout').then(response => {
          if (response.data.success) {
            this.$router.push('/login');
          }
        }).catch(console.error);
      }
    }
  }
</script>
