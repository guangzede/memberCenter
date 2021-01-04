import request from '@/utils/request'

export function getHonorTreeList() {
  return request({
    url: '/honor/getHonorTreeList',
    method: 'post'
  })
}

export function getHonorList(data) {
  return request({
    url: '/honor/getHonorList',
    method: 'post',
    data
  })
}

export function editSave(data) {
  return request({
    url: '/honor/edit',
    method: 'post',
    data
  })
}

export function addSave(data) {
  return request({
    url: '/honor/add',
    method: 'post',
    data
  })
}

export function addSaveList(data) {
  return request({
    url: '/honor/addList',
    method: 'post',
    data
  })
}

export function getUnselectedClients(data) {
  return request({
    url: '/honor/getClientsByName',
    method: 'get',
    params: data
  })
}

export function updateName(data) {
  return request({
    url: '/honor/updateName',
    method: 'post',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: '/honor/updateStatus',
    method: 'post',
    data
  })
}

export function getHonorAcquireInfoAdmin(data) {
  return request({
    url: '/honor/getHonorAcquireInfoAdmin',
    method: 'get',
    params: data
  })
}
