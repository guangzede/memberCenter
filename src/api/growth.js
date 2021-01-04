import request from '@/utils/request'

export function getLevelInfoByGrowth(data) {
  return request({
    url: '/level/getLevelInfoByGrowth',
    method: 'get',
    params: data
  })
}

export function getLevelInfo(data) {
  return request({
    url: '/level/getLevelList',
    method: 'post',
    data
  })
}

export function addLevelInfo(data) {
  return request({
    url: '/level/add',
    method: 'post',
    data
  })
}

export function editLevelInfo(data) {
  return request({
    url: '/level/edit',
    method: 'post',
    data
  })
}

export function intervalValidity(data) {
  return request({
    url: '/level/intervalValidity',
    method: 'post',
    data
  })
}

export function deleteLevel(id) {
  return request({
    url: '/level/remove/' + id,
    method: 'post'
  })
}

export function updateStatus(data) {
  return request({
    url: '/level/updateStatus',
    method: 'post',
    data
  })
}

export function putLevelInfo(data) {
  return request({
    url: '/business/level-info',
    method: 'put',
    data
  })
}
export function getGrowthConfig(data) {
  return request({
    url: '/business/integral-growth-config',
    method: 'get',
    params: data
  })
}
export function putGrowthConfig(data) {
  return request({
    url: '/business/integral-growth-config',
    method: 'put',
    data
  })
}
export function getIntegralTacticsList(data) {
  return request({
    url: '/business/integral-tactics-list',
    method: 'get',
    params: data
  })
}
export function getGrowthTacticsList(data) {
  return request({
    url: '/business/growth-tactics-list',
    method: 'get',
    params: data
  })
}
export function getGrowthSteam(data) {
  return request({
    url: '/business/getGrowthFlow',
    method: 'post',
    data
  })
}
export function selectPGScale(data) {
  return request({
    url: '/brand_mem_admin/selectPGScale',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    data: { ...data }
  })
}
export function savePGScale(data) {
  return request({
    url: '/brand_mem_admin/savePGScale',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    data: { ...data }
  })
}
export function getGrowthSteamBrand(data) {
  return request({
    url: '/brand_mem_admin/selectGrowthListForDetail',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    data: { ...data }
  })
}
export function getChoiseListForPG(data) {
  return request({
    url: '/brand_mem_admin/selectChoiseListForPG',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    data: { ...data }
  })
}
export function exprotExcel(data) {
  return request({
    url: '/business/exportGrowthFlow',
    method: 'post',
    data
  })
}
export function exportGrowthListExcel(data) {
  return request({
    url: '/brand_mem_admin/exportGrowthListForDetail',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    data: { ...data },
    responseType: 'blob'
  })
}
export function putFlag(data) {
  return request({
    url: '/business/integral-tactics',
    method: 'put',
    data
  })
}
export function postAdd(data) {
  return request({
    url: '/business/growth-tactics',
    method: 'post',
    data
  })
}
export function uploadImg(data) {
  return request({
    url: '/business/upload',
    method: 'post',
    data
  })
}

export function getCount() {
  return request({
    url: '/level/getCount',
    method: 'get'
  })
}

