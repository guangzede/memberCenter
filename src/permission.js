import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { getToken } from '@/utils/auth' // get token from cookie
const whiteList = ['/login', '/', '/dashboard']
NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
  'use strict'
  document.title = to.meta.title
    ? `${to.meta.title} - 一汽会员中心`
    : '一汽会员中心'
  // document.title = '2020年4月8日13:20:06'
  NProgress.start()
  var hasToken = getToken()
  if (hasToken) {
    if (to.path === '/') {
      next('/dashboard')
      NProgress.done()
    } else {
      next()
      NProgress.done()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
      NProgress.done()
    } else {
      next('/')
      NProgress.done()
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})
