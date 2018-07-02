import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

const state = {
  user: null,
  token: null,
  isAuthenticated: false,
  workspace: null,
  workspaceStatus: false
}

const mutations = {
  USER_DATA: (state, data) => {
    state.user = data
  },
  SET_WORKSPACE_ACTIVE: (state, data) => {
    state.workspace = data.id
    state.workspaceStatus = data.status
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
    state.workspace = null
    state.workspaceStatus = false
  },
  RESET_WORKSPACE: (state) => {
    state.workspace = null
    state.workspaceStatus = false
  }
}

export default new Vuex.Store({
  state,
  mutations,
  plugins: [
    createPersistedState()
  ]
})
