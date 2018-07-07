// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'
import store from './vuex/store'
import { sync } from 'vuex-router-sync'
import io from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'

import('../node_modules/vuetify/dist/vuetify.min.css')
Vue.use(Vuetify)

sync(store, router)

const socket = io('')
Vue.use(VueSocketIO, socket, store)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  socket,
  components: { App },
  template: '<App/>'
})
