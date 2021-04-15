import Vue from 'vue/dist/vue.common.prod';
import { Vuelidate } from 'vuelidate/dist/vuelidate.min';
import VueRouter from 'vue-router/dist/vue-router.min';

Vue.config.productionTip = false;

import App from './App.vue';

import firebaseWrapper from './authentication/firebase_wrapper';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

//init firebase auth
firebaseWrapper.initializeApp();

//bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

//custom css
import './css/main.scss';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(Vuelidate);
Vue.use(VueRouter);

const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }
const Home = { template: '<h3>Home</h3>'}
const PageNotFound = { template: '<h3>Page not found.</h3>'}

const routes = [
  { path: '/', component: Home },
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar },
  { path: '/*', component: PageNotFound }
];

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app');
