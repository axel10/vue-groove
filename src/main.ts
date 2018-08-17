import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import iview from 'iview'
import axios from 'axios'
// axios.defaults.baseURL = 'http://localhost:5321/'
// import 'iview/dist/styles/iview.css';



Vue.use(iview);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');