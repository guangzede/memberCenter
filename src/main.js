// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import '@/icons/SvgIcon.vue'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import '@/permission'
import store from './store/index.js'
import HappyScroll from 'vue-happy-scroll'
// 引入css
import 'vue-happy-scroll/docs/happy-scroll.css'
Vue.use(HappyScroll)
import Router from 'vue-router'
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

import SvgIcon from '@/icons/SvgIcon.vue'// svg component

// 注册全局svg组件
Vue.component('svg-icon', SvgIcon)
const req = require.context('@/icons/svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

Vue.use(ElementUI, { size: 'mini', zIndex: 3000 })
Vue.use(Vuex)
Vue.config.productionTip = false

// echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
import 'echarts/theme/macarons.js'

/* eslint-disable no-new */

new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
