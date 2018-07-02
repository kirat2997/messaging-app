import axios from 'axios'
import decode from 'jwt-decode'

import store from '../vuex/store'
import router from '../router/index'

export async function userSignup (name, email, password) {
  try {
    const response = await axios.request({
      url: '/api/signup',
      method: 'post',
      data: {
        name,
        email,
        password
      }
    })
    if (response.status === 200) {
      return 'success'
    }
  } catch (e) {
    if (e.response.status === 404) {
      return 'exist'
    } else {
      return false
    }
  }
}

export async function userLogin (email, password) {
  try {
    const response = await axios.request({
      url: '/api/login',
      method: 'post',
      data: {
        email,
        password
      }
    })
    if (response.status === 200) {
      await checkToken(response.data)
    }
  } catch (e) {
    if (e.response.status === 400) {
      return 'no account'
    } else {
      return false
    }
  }
}

export async function shouldContinueOrNot (to, from, next) {
  if (store.state.isAuthenticated) {
    next('/home')
  } else {
    next()
  }
}

export async function isAuthenticated (to, from, next) {
  if (store.state.isAuthenticated) {
    next()
  } else {
    next('/')
  }
}

export async function checkToken (token) {
  let decoded
  try {
    decoded = decode(token)
    if (!isTokenExpired(decoded)) {
      store.commit('SET_TOKEN', token)
      const result = await getUserFromToken(decoded)
      if (!result) {
        router.push('/')
      }
      store.commit('CHANGE_AUTH_STATE', true)
      router.push('/home')
    } else {
      store.commit('RESET_STATE')
      router.push('/')
    }
  } catch (e) {
    store.commit('RESET_STATE')
    router.push('/')
  }
}

function isTokenExpired (token) {
  const expirationDate = getTokenExpirationDate(token)
  return expirationDate < new Date()
}

function getTokenExpirationDate (token) {
  if (!token.exp) { return null }
  const date = new Date(0)
  date.setUTCSeconds(token.exp)
  return date
}

async function getUserFromToken (decoded) {
  try {
    const response = await axios.request({
      url: `/api/accounts/${decoded.accountId}`,
      headers: {'Authorization': 'Bearer ' + store.state.token},
      method: 'get'
    })
    store.commit('USER_DATA', response.data)
  } catch (e) {
    if (e.response.status === 401) {
      return false
    }
  }
  return true
}
