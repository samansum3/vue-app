import Vue from 'vue/dist/vue.common.prod';
import Vuelidate from 'vuelidate';

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

new Vue({
  render: h => h(App),
}).$mount('#app');
