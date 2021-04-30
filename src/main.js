import Vue from 'vue/dist/vue.common.prod';
import { Vuelidate } from 'vuelidate/dist/vuelidate.min';
import VueRouter from 'vue-router/dist/vue-router.min';
import VueProgressBar from 'vue-progressbar/dist/vue-progressbar';

Vue.config.productionTip = false;

import App from './App.vue';
const Login = () => import(/* webpackChunkName: 'login' */ './components/login');
const User = () => import(/* webpackChunkName: 'user' */ './components/user');
import Spinner from './components/spinner';

import firebaseWrapper from './authentication/firebase_wrapper';
import { BootstrapVue, IconsPlugin, BootstrapVueIcons } from 'bootstrap-vue';

//init firebase auth
firebaseWrapper.initializeApp();

//bootstrap
import 'bootstrap/dist/js/bootstrap.min';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css';
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
Vue.use(BootstrapVueIcons);
Vue.use(Vuelidate);
Vue.use(VueRouter);

Vue.use(VueProgressBar, {
    color: 'rgb(143, 255, 199)',
    failedColor: 'red',
    height: '2px'
});

//Register global components
Vue.component('Spinner', Spinner);

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

var vm = null;

router.beforeEach((to, from, next) => {
  vm?.$Progress.start();
  axios.get('/auth_check/').then(response => {
    if (response.data.success) {
      to.name === 'Login' ? next('/') : next();
    } else {
      to.name === 'Login' ? next() : next('/login');
    }
  }).catch(error => {
    vm?.$Progress.fail();
    console.error(error);
    next(false);
  });
  from; //treat as used variable
});

router.afterEach(() => {
  vm?.$Progress.finish();
});

vm = new Vue({
  render: h => h(App),
  router,
}).$mount('#app');
