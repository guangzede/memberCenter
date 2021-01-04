import request from '@/utils/request'
const data = {
  pageNo: 1,
  pageSize: 11110
}
export function getMenu(data) {
  return request({
    url: '/admin/role-menu-by-code',
    method: 'get',
    params: data
  })
}
export function addRoleMenu(data) {
  return request({
    url: '/admin/role-menu',
    method: 'post',
    data
  })
}
export function deleteRoleMenu(data) {
  return request({
    url: '/admin/role-menu',
    method: 'delete',
    params: { ...data }
  })
}
export function deleteMenu(data) {
  return request({
    url: '/admin/menu',
    method: 'delete',
    params: { ...data }
  })
}
export function addMenu(data) {
  return request({
    url: '/admin/menu',
    method: 'post',
    data
  })
}
export function updateMenu(data) {
  return request({
    url: '/admin/menu',
    method: 'put',
    data
  })
}
export function getMenuList() {
  return request({
    url: '/admin/menu-list',
    method: 'get',
    params: data
  })
}
