import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

const state = {
  user: null,
  token: null,
  isAuthenticated: false
}

const mutations = {
  USER_DATA: (state, data) => {
    state.user = data
  },
  CHANGE_AUTH_STATE: (state, auth) => {
    state.isAuthenticated = auth
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  RESET_STATE: (state) => {
    state.token = null
    state.user = null
    state.isAuthenticated = false
  }
}

export default new Vuex.Store({
  state,
  mutations,
  plugins: [
    createPersistedState()
  ]
})
