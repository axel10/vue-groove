import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from './store/index'
import iview from 'iview'
import axios from 'axios'
import VPButton from '@/components/VPButton.vue'
import LikeBtnGroup from '@/components/LikeBtnGroup.vue'
import mainApi from '@/api/mainApi'
// axios.defaults.baseURL = 'http://localhost:5321/'
// import 'iview/dist/styles/iview.css';

axios.defaults.withCredentials = true

Vue.use(iview)
Vue.config.productionTip = false


Vue.component('VPButton', VPButton)
Vue.component('LikeBtnGroup', LikeBtnGroup)


new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
