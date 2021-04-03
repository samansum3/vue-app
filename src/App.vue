<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <button class="btn btn-primary" @click="sendTestRequest">Send</button>
    <button class="btn btn-primary" @click="getInvoices">Get invoices</button>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'App',
    components: {
      
    },
    methods: {
      sendTestRequest() {
        axios.post('/post').then(console.log).catch(console.error);
      },
      getInvoices() {
        axios.get('/invoice/get-all').then(console.log).catch(console.error);
      }
    }
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
