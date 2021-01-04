
import Vue from 'vue'
import Vuex from 'vuex'
import ls from '../utils/localStorage'
Vue.use(Vuex)
const stores = new Vuex.Store({
  state: {
    count: 0,
    isCollapse: false,
    user: {
      img: 'https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/home/img/qrcode/zbios_09b6296.png',
      userName: '',
      loginName: '',
      phone: '',
      roleCode: '',
      email: '',
      id: '',
      menuList: []
    },
    settings: {
      size: 'mini'
    },
    data: {},
    activeName: 'transform',
    isLogin: null,
    editable: null,
    isAdjustment: null,
    flush: null,
    rightsType: null,
    isDetail: null
  },
  getters: {
    isDetail: state => {
      return state.isDetail === null ? ls.getLocalStorage('isDetail') : state.isDetail
    },
    rightsType: state => {
      return state.rightsType ? state.rightsType : ls.getLocalStorage('rightsType')
    },
    flush: state => {
      return state.flush === null ? ls.getLocalStorage('flush') : state.flush
    },
    isAdjustment: state => {
      return state.isAdjustmen === null ? ls.getLocalStorage('isAdjustment') : state.isAdjustment
    },
    editable: state => {
      return state.editable === null ? ls.getLocalStorage('editable') : state.editable
    },
    isLogin: state => {
      return !state.isLogin ? ls.getLocalStorage('isLogin') : state.isLogin
    },
    activeName: state => {
      return ls.getLocalStorage('activeName') || state.activeName
    },
    user: state => {
      return JSON.stringify({ ...state.user }) === '{}' ? ls.getLocalStorage('user') : state.user
    },
    isCollapse: state => {
      return ls.getLocalStorage('isCollapse') || state.isCollapse
    },
    count: state => {
      return ls.getLocalStorage('count') || state.count
    },
    data: state => {
      return JSON.stringify({ ...state.data }) === '{}' ? ls.getLocalStorage('data') : state.data
    }
  },
  mutations: {
    flush(state, data) {
      state.flush = data
      ls.putLocalStorage('flush', data)
    },
    setRightsType(state, data) {
      state.rightsType = data
      ls.putLocalStorage('rightsType', data)
    },
    increment(state) {
      state.isCollapse = !state.isCollapse
      ls.putLocalStorage('isCollapse', !state.isCollapse)
    },
    postData(state, data) {
      state.data = data
      ls.putLocalStorage('data', data)
    },
    logInfo(state, info) {
      state.user = { ...info }
      ls.putLocalStorage('user', { ...info })
    },
    userMenu(state, menu) {
      state.user.menuList = menu
      ls.putLocalStorage('menuList', menu)
    },
    tabChangeActive(state, active) {
      ls.putLocalStorage('activeName', active)
      state.activeName = active
    },
    Login(state) {
      ls.putLocalStorage('isLogin', true)
      state.isLogin = true
    },
    isDetail(state, type) {
      ls.putLocalStorage('isDetail', type)
      state.isDetail = type
    },
    editable(state, type) {
      ls.putLocalStorage('editable', type)
      state.editable = type
    },
    isAdjustment(state, value) {
      ls.putLocalStorage('isAdjustment', value)
      state.isAdjustment = value
    }
  }
})

// const store = new Proxy(stores, {
//   get: (target, propKey, receiver) => {
//     if (propKey === 'state') {
//       return ls.getLocalStorage
//     }
//     return Reflect.get(target, propKey, receiver)
//   },
//   set: (target, propKey, value, receiver) => {
//     return Reflect.set(target, propKey, value, receiver)
//   }
// })
export default stores
