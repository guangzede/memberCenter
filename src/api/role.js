import request from '@/utils/request'

export function getRoleList(data) {
  return request({
    url: '/admin/role-list',
    method: 'get',
    params: { ...data }
  })
}
export function deleteRole(data) {
  return request({
    url: '/admin/role',
    method: 'delete',
    params: { ...data }
  })
}
export function addRole(data) {
  return request({
    url: '/admin/role',
    method: 'post',
    data
  })
}
export function updateRole(data) {
  return request({
    url: '/admin/role',
    method: 'put',
    data
  })
}
