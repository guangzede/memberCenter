import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
// const config = require('../../config')
import { removeToken } from '@/utils/auth'

import { showFullScreenLoading, tryHideFullScreenLoading } from './loading'
// const buildProd = config.build.buildProd
// const buildStage = config.build.buildStage
const basePath = process.env.NODE_ENV === 'development'
  ? '/api'
  : '/member-admin'
const schedulerBasePath = process.env.NODE_ENV === 'development'
  ? '/schedulerApi'
  : '/member-scheduler'
const exchangeBasePath = process.env.NODE_ENV === 'development'
  ? '/exchangeApi'
  : '/member-exchange'
// const brandBasePath = process.env.NODE_ENV === 'development'
//   ? ''
//   : '/dcep-brand-member'
// const basePath = '/member-admin'
// basePath = buildProd
const service = axios.create({
  baseURL: basePath, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout,
})
// request interceptor
service.interceptors.request.use(
  config => {
    if (config.url.includes('/brand_mem_admin')) {
      const tmpData = 'inParaJsonStr=' + encodeURIComponent(JSON.stringify(config.data))
      config.data = tmpData
      config.headers['token'] = getToken()
    }
    showFullScreenLoading()
    if (config.method === 'get' && config.params ? config.params.token : false) {
      config.url += '?cheatIdiotInterExplorer=' + new Date().getTime()
    }
    if (config.url.includes('quartzJob')) {
      config.baseURL = schedulerBasePath
    }
    if (config.url.includes('exchange')) {
      config.baseURL = exchangeBasePath
    }
    config.headers['token'] = getToken()
    config.url = filterUrl(config.url)
    return config
  },
  error => {
    tryHideFullScreenLoading()
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    tryHideFullScreenLoading()
    if (res.errorCode === '020006') {
      Message({
        message: '身份过期，请重新登录',
        type: 'error',
        duration: 2 * 1000
      })
      removeToken()
      window.location.href = location.origin
      return res
    } else if (res.resultStatus === 'FAILED') {
      Message({
        message: res.errorMessage,
        type: 'error',
        duration: 2 * 1000
      })
      return res
    } else {
      if (res.code === 'E') {
        if (res.message === null) {
          Message({
            message: res.data,
            type: 'error',
            duration: 2 * 1000
          })
        } else {
          Message({
            message: res.message,
            type: 'error',
            duration: 2 * 1000
          })
        }
      }
      return res
    }
  },
  error => {
    console.log('err' + error)
    let { message } = error
    if (message === 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    tryHideFullScreenLoading()
    return Promise.reject(error)
  }
)

function filterUrl(url) {
  return url.indexOf('?') !== -1 ? `${url}&t=${new Date().getTime()}` : `${url}?t=${new Date().getTime()}`
}

export default service

// function isErrorMessage(code) {
//   const messageList = ['020000', '020001', '020002', '020003', '020004', '020005', '020007', '020008', '020009', '020010', '020011', '020012', '020013', '020014', '020015', '020016', '020017', '020018']
//   for (const i of messageList) {
//     if (code === i) {
//       return true
//     }
//   }
//   return false
// }

