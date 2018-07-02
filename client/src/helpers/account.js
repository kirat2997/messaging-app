import axios from 'axios'

import store from '../vuex/store'
import router from '../router/index'

export async function createWorkspace (name, displayName, password) {
  try {
    const accountId = store.state.user._id
    const token = store.state.token
    const response = await axios.request({
      url: `/api/createWorkspace/${accountId}`,
      method: 'post',
      headers: {'Authorization': 'Bearer ' + token},
      data: {
        name,
        displayName,
        password
      }
    })
    if (response.status === 200) {
      store.commit('USER_DATA', response.data)
      return 'success'
    }
  } catch (e) {
    if (e.response.status === 420) {
      return 'exist'
    } else {
      return false
    }
  }
}

export async function workspaceLogin (id, password) {
  try {
    const accountId = store.state.user._id
    const token = store.state.token
    const response = await axios.request({
      url: `/api/workspaceLogin/${accountId}`,
      method: 'post',
      headers: {'Authorization': 'Bearer ' + token},
      data: {
        id,
        password
      }
    })
    if (response.status === 200) {
      store.commit('SET_WORKSPACE_ACTIVE', {id, status: true})
      router.push(`/workspace`)
    }
  } catch (e) {
    if (e.response.status === 404) {
      return 'some error'
    } else {
      return false
    }
  }
}

export async function fetchWorkspace (workspaceId) {
  try {
    const token = store.state.token
    const response = await axios.request({
      url: `/api/fetchWorkspace/${workspaceId}`,
      method: 'get',
      headers: {'Authorization': 'Bearer ' + token}
    })
    if (response.status === 200) {
      return response.data
    }
  } catch (e) {
    return false
  }
}
