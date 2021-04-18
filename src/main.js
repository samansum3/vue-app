import Vue from 'vue/dist/vue.common.prod';
import { Vuelidate } from 'vuelidate/dist/vuelidate.min';
import VueRouter from 'vue-router/dist/vue-router.min';

Vue.config.productionTip = false;

import App from './App.vue';
import Login from './components/login';
import User from './components/user';

import firebaseWrapper from './authentication/firebase_wrapper';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

//init firebase auth
firebaseWrapper.initializeApp();

//bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'sweetalert2/dist/sweetalert2.min.css';

//custom css
import './css/main.scss';

import VueCookies from 'vue-cookies';
Vue.use(VueCookies);

VueCookies.config('5d');

import axios from 'axios/dist/axios.min';
axios.defaults.withCredentials = true;


Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(Vuelidate);
Vue.use(VueRouter);

const Foo = { template: '<div>foo</div>' }
const Home = { template: '<h3>Home</h3>'}
const PageNotFound = { template: '<h3>Page not found.</h3>'}

const routes = [
  { name: 'Home', path: '/', component: Home },
  { name: 'Foo', path: '/foo', component: Foo },
  { name: 'User', path: '/user', component: User },
  { name: 'Login', path: '/login', component: Login },
  { name: 'PageNotFound', path: '/*', component: PageNotFound }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  axios.get('/auth_check/').then(response => {
    if (response.data.success) {
      to.name === 'Login' ? next('/') : next();
    } else {
      to.name === 'Login' ? next() : next('/login');
    }
  }).catch(error => {
    console.error(error);
    next(false);
  });
  from; //treat as used variable
});

new Vue({
  render: h => h(App),
  router
}).$mount('#app');
