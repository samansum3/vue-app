<template>
  <div id="app">
    <vue-progress-bar></vue-progress-bar>
    <template>
      <navbar v-if="$route.name && ($route.name !== 'Login')"></navbar>
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
  import Navbar from './components/navbar';

  export default {
    name: 'App',
    components: {
      Navbar
    }
  }
</script>
