import request from '@/utils/request'

export function getInfo(data) {
  return request({
    url: '/business/client-list',
    method: 'get',
    params: data
  })
}
export function putInfo(data) {
  return request({
    url: '/business/client',
    method: 'put',
    data
  })
}
export function postInfo(data) {
  return request({
    url: '/business/client',
    method: 'post',
    data
  })
}
