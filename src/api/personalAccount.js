import request from '@/utils/request'

export function childAccountListDataMap(data) {
  return request({
    url: '/exchange/personalChildAccount/listDataMap',
    method: 'post',
    data: data
  })
}
export function totalAccountListDataMap(data) {
  return request({
    url: '/exchange/personalTotalAccount/listDataMap',
    method: 'post',
    data: data
  })
}
export function getChildTotalAccountRatio() {
  return request({
    url: '/exchange/childTotalAccountRatio/listData',
    method: 'get'
  })
}
export function saveChildTotalAccountRatio(data) {
  return request({
    url: '/exchange/childTotalAccountRatio/save',
    method: 'post',
    data: data
  })
}
export function childAccountDetailListDataMap(data) {
  return request({
    url: '/exchange/personalChildAccountDetail/listDataMap',
    method: 'post',
    data: data
  })
}
export function totalAccountDetailListDataMap(data) {
  return request({
    url: '/exchange/personalTotalAccountDetail/listDataMap',
    method: 'post',
    data: data
  })
}
