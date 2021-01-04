import request from '@/utils/request'

export function getInfo(data) {
  return request({
    url: '/business/integral-tactics-list',
    method: 'get',
    params: data
  })
}
// PUT /business/integral-tactics
export function putFlag(data) {
  return request({
    url: '/business/integral-tactics',
    method: 'put',
    data
  })
}
