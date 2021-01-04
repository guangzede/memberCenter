import request from '@/utils/request'

export function tableList(data) {
  return request({
    url: '/member/list',
    method: 'get',
    data
  })
}
export function postAdd(data) {
  return request({
    url: '/business/integral-tactics',
    method: 'post',
    data
  })
}

export function updataGrowth(data) {
  return request({
    url: '/business/growth-tactics',
    method: 'post',
    data
  })
}

export function getITCWL(data) {
  return request({
    url: '/business/integral-tactics-client-w-list',
    method: 'get',
    params: { ...data }
  })
}

export function getITCYL(data) {
  return request({
    url: '/business/integral-tactics-client-y-list',
    method: 'get',
    params: { ...data }
  })
}
export function deleteTactics(data) {
  return request({
    url: '/business/integral-tactics-client',
    method: 'delete',
    params: { ...data }
  })
}
export function postTactics(data) {
  return request({
    url: '/business/integral-tactics-client',
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
export function getSteam(data) {
  return request({
    url: '/business/query-member-integral-flow',
    method: 'get',
    params: { ...data }
  })
}

export function getTactics() {
  return request({
    url: '/business/getTactics',
    method: 'post'
  })
}

export function getclientId() {
  return request({
    url: '/business/getclientId',
    method: 'post'
  })
}

export function getAccumulateSteamBrand(data) {
  return request({
    url: '/brand_mem_admin/selectPointListForDetail',
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
    url: '/business/query-member-integral-flow-export',
    method: 'get',
    params: { ...data },
    contentType: 'application/json;charset=UTF-8',
    token: ''
  })
}
export function exprotExcelPhone(data) {
  return request({
    url: '/business/query-member-integral-flow-export-phone',
    method: 'get',
    params: { ...data },
    contentType: 'application/json;charset=UTF-8',
    token: ''
  })
}
export function exportBrandPointListExcel(data) {
  return request({
    url: '/brand_mem_admin/exportBrandPointListExcel',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    data: { ...data },
    responseType: 'blob'
  })
}
export function applyInfoList(data) {
  return request({
    url: '/usercenter/apply-info-list',
    method: 'get',
    params: { ...data }
  })
}
export function applyDetailList(data) {
  return request({
    url: '/usercenter/apply-detail-list',
    method: 'get',
    params: { ...data }
  })
}
export function queryUserInfo(data) {
  return request({
    url: '/usercenter/query-user-info',
    method: 'get',
    params: { ...data }
  })
}
export function postApplyInfo(data) {
  return request({
    url: '/usercenter/apply-info',
    method: 'post',
    data
  })
}
export function deleteApplyDetail(data) {
  return request({
    url: '/usercenter/apply-detail-del',
    method: 'delete',
    params: { ...data }
  })
}

export function postApplyApproved(data) {
  return request({
    url: '/usercenter/apply-Approved',
    method: 'post',
    data
  })
}

export function freezeFlow(data) {
  return request({
    url: '/business/query-member-integral-freeze-flow',
    method: 'get',
    params: { ...data }
  })
}
export function exportFreezeFlow(data) {
  return request({
    url: '/business/query-member-freeze-flow-export',
    method: 'get',
    params: { ...data }
  })
}
export function selectToeClients(data) {
  return request({
    url: '/business/selectToeClients',
    method: 'get',
    params: { ...data }
  })
}
