import request from '@/utils/request'
export function tableList(data) {
  return request({
    url: '/member/list',
    method: 'get',
    data
  })
}

export function memberDetail(data) {
  return request({
    url: '/member/memberDetail',
    method: 'get',
    data
  })
}

export function getEquityInfo(data) {
  return request({
    url: '',
    method: 'get',
    data
  })
}
export function uesrCenter(data) {
  return request({
    url: '/usercenter/userinfo-list',
    method: 'get',
    params: { ...data }
  })
}
export function vehicleinfo(data) {
  return request({
    url: '/usercenter/vehicleinfo-list',
    method: 'get',
    params: { ...data }
  })
}
export function detailList(data) {
  return request({
    url: '/usercenter/integral-detail-list',
    method: 'get',
    params: { ...data }
  })
}
export function detail(data) {
  return request({
    url: '/usercenter/integral-info',
    method: 'get',
    params: { ...data }
  })
}
export function vehicleList(data) {
  return request({
    url: '/usercenter/vehicle-revoke-list',
    method: 'get',
    params: { ...data }
  })
}

export function getVin(data) {
  return request({
    url: '/usercenter/query-vehicle-by-vin',
    method: 'get',
    params: { ...data }
  })
}
export function saveRevokeInfo(data) {
  return request({
    url: '/usercenter/save-revoke-info',
    method: 'post',
    data
  })
}
export function exportDownload(data) {
  return request({
    url: '/usercenter/userinfo-export',
    method: 'get',
    params: { ...data }
  })
}
export function downloadList(data) {
  return request({
    url: '/usercenter/userinfo-export-list',
    method: 'get',
    params: { ...data }
  })
}
export function freezeList(data) {
  return request({
    url: '/usercenter/freeze-detail-list',
    method: 'get',
    params: { ...data }
  })
}

