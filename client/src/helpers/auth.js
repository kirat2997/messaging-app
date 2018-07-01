import axios from 'axios'
// import store from '../vuex/store'

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
