import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
import sotre from '../store'
import { tree0 } from '@/utils/menu'

// import { getToken } from '@/utils/auth'
Vue.use(Router)

var router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      alias: '/login',
      hidden: true,
      component: () => import('@/pages/login/index')
    },
    {
      path: '',
      hidden: true,
      redirect: '/'
    },
    {
      path: '/dashboard',
      hidden: true,
      component: Layout,
      children: [{
        hidden: true,
        path: '',
        component: () => import('@/pages/dashboard/index')
      }]
    },
    {
      path: '/404',
      hidden: true,
      component: () => import('@/pages/404')
    }
  // { path: '*', redirect: '/404', hidden: true }
  ]
})
if (localStorage.userMenu) {
  // console.log(JSON.parse(localStorage.userMenu))
  var temp = tree0(JSON.parse(localStorage.userMenu))
  temp.push({ path: '*', redirect: '/404', hidden: true })
  sotre.commit('userMenu', temp)
  temp = [...new Set([...router.options.routes, ...temp])]
  router.options.routes = [...temp]
  router.addRoutes(temp)
}

export default router
