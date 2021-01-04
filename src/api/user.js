import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/user/login',
    method: 'get',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/user-info',
    method: 'get',
    params: { token }
  })
}

export function getCode(data) {
  return request({
    url: `/admin/login?${data}`,
    method: 'get'
  })
}
export function getUserInfoList(data) {
  return request({
    url: `/business/system-user-info-list`,
    method: 'get',
    params: { ...data }
  })
}
export function putSystemUserInfo(data) {
  return request({
    url: `/business/system-user-info`,
    method: 'put',
    data
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'get'
  })
}
export function getRoleDictList() {
  return request({
    url: '/admin/role-dict-list',
    method: 'get'
  })
}

