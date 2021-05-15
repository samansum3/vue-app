import Vue from 'vue/dist/vue.common.prod';
import { Vuelidate } from 'vuelidate/dist/vuelidate.min';
import VueRouter from 'vue-router/dist/vue-router.min';
import VueProgressBar from 'vue-progressbar/dist/vue-progressbar';

Vue.config.productionTip = false;

import App from './App.vue';
const Login = () => import(/* webpackChunkName: 'login' */ './components/login');
const Home = () => import(/* webpackChunkName: 'home' */ './components/home');
const User = () => import(/* webpackChunkName: 'user' */ './components/user');
const PostManageMent = () => import(/* webpackChunkName: 'post' */ './components/post_management');
const PostView = () => import(/* webpackChunkName: 'post-view' */ './components/post/post_view');
const MyProfile = () => import(/* webpackChunkName: 'my-profile' */ './components/my_profile');
import Spinner from './components/spinner';
import DateFormater from './mixins/date_format.es';

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

VueCookies.config('6h');

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

//Register global components or mixins
Vue.component('Spinner', Spinner);
Vue.mixin(DateFormater);

const PageNotFound = { template: '<h3>Page not found.</h3>'}

const routes = [
  { name: 'Login', path: '/login', component: Login },
  { name: 'Home', path: '/', component: Home },
  { name: 'Post', path: '/post', component: PostManageMent },
  { name: 'PostVew', path: '/post/view', component: PostView },
  { name: 'User', path: '/user', component: User },
  { name: 'MyProfile', path: '/my-profile', component: MyProfile },
  { name: 'PageNotFound', path: '/page-not-found', component: PageNotFound },
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
