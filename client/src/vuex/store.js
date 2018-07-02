import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

const state = {
  user: null,
  token: null,
  isAuthenticated: false,
  workspaces: []
}

const mutations = {
  USER_DATA: (state, data) => {
    state.user = data
  },
  WORKSPACE_DATA: (state, data) => {
    state.workspaces = data
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
    state.workspaces = []
  }
}

export default new Vuex.Store({
  state,
  mutations,
  plugins: [
    createPersistedState()
  ]
})
