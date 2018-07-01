import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Home from '@/components/Home'

import { checkToken, shouldContinueOrNot, isAuthenticated } from '../helpers/auth'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      beforeEnter: shouldContinueOrNot
    },
    {
      path: '/callback/:token',
      beforeEnter: checkToken
    },
    {
      path: '/home/:data?',
      component: Home,
      beforeEnter: isAuthenticated,
      props: (route) => ({
        data: route.params.data
      })
    }
  ]
})
