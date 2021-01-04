import request from '@/utils/request'

export function getClintList() {
  return request({
    url: '/business/client-list',
    method: 'get',
    params: { pageNo: 1, pageSize: 99999 }
  })
}
export function getRuleList(data) {
  return request({
    url: '/business/tactics-dict',
    method: 'get',
    params: { ...data }
  })
}
export function getScene(data) {
  return request({
    url: '/business/numerical-interval',
    method: 'get',
    params: { ...data }
  })
}
export function getSceneDetail(data) {
  return request({
    url: '/business/numerical-interval-detail',
    method: 'get',
    params: { ...data }
  })
}

export function addScene(data) {
  return request({
    url: '/business/numerical-interval',
    method: 'post',
    data
  })
}
export function putScene(data) {
  return request({
    url: '/business/numerical-interval',
    method: 'put',
    data
  })
}
