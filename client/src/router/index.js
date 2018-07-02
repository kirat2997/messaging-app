import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Home from '@/components/Home'
import WorkSpace from '@/components/WorkSpace'

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
      path: '/home',
      component: Home,
      beforeEnter: isAuthenticated
    },
    {
      path: '/workspace/:id?',
      component: WorkSpace,
      props: (route) => ({
        id: route.params.id
      })
    }
  ]
})
