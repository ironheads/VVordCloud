import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import AsyncComputed from 'vue-async-computed'
import animate from 'animate.css'
Vue.config.productionTip = false
Vue.use(AsyncComputed)
Vue.use(animate)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
