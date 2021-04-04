import Vue from 'vue';
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

Vue.config.productionTip = false

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

new Vue({
  render: h => h(App),
}).$mount('#app');
