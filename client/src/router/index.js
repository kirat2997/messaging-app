import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Home from '@/components/Home'
import WorkSpace from '@/components/WorkSpace'

import { checkToken, shouldContinueOrNot, shouldContinueOrNotIndex, isAuthenticated } from '../helpers/auth'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      beforeEnter: shouldContinueOrNotIndex
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
      path: '/workspace/:channel?',
      component: WorkSpace,
      beforeEnter: shouldContinueOrNot,
      props: (route) => ({
        channel: route.params.channel
      })
    }
  ]
})
