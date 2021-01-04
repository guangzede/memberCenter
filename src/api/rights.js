import request from '@/utils/request'

export function rightAssignmentInfo(data) {
  return request({
    url: '/right/query-rights-assignment-info',
    method: 'get',
    params: { ...data }
  })
}

export function rightsQueryInfo(data) {
  return request({
    url: '/right/query-rights-info',
    method: 'get',
    params: { ...data }
  })
}
export function updateRightInfo(data) {
  return request({
    url: '/right/update-right-info',
    method: 'put',
    data
  })
}
export function updateRightInfoStatus(data) {
  return request({
    url: '/right/update-right-info-status',
    method: 'put',
    data
  })
}

export function addRightsInfo(data) {
  return request({
    url: '/right/add-right-info',
    method: 'post',
    data
  })
}

export function getITCWL(data) {
  return request({
    url: '/right/rights-client-w-list',
    method: 'get',
    params: { ...data }
  })
}
export function getITCYL(data) {
  return request({
    url: '/right/rights-client-y-list',
    method: 'get',
    params: { ...data }
  })
}
export function addRightsClient(data) {
  return request({
    url: '/right/add-rights-client',
    method: 'post',
    data
  })
}
export function addLevelRightsInfo(data) {
  return request({
    url: '/right/add-level-rights-info',
    method: 'post',
    data
  })
}
export function getClintInfo() {
  return request({
    url: '/business/client-info-list',
    method: 'get'
  })
}

export function deleteRightsClient(data) {
  return request({
    url: '/right/del-rights-client',
    method: 'delete',
    params: { ...data }
  })
}
export function queryUserLevel(data) {
  return request({
    url: '/right/query-user-level',
    method: 'get',
    params: { ...data }
  })
}
export function queryLevelRightInfo(data) {
  return request({
    url: '/right/query-level-rights-info',
    method: 'get',
    params: { ...data }
  })
}
export function queryRightsConfList(data) {
  return request({
    url: '/right/query-rights-conf-info',
    method: 'get',
    params: { ...data }
  })
}
export function queryLevelByRightId(data) {
  return request({
    url: '/right/query-level-by-rightId',
    method: 'get',
    params: { ...data }
  })
}
