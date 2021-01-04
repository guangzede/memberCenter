import request from '@/utils/request'

// 查询积分池列表
export function listPool(data) {
  return request({
    url: '/exchange/integralPool/list',
    method: 'post',
    data: data
  })
}
// 查询未过期的积分池
export function getNotInvalidPoolAll(data) {
  return request({
    url: 'exchange/integralPool/notInvalidListAll',
    method: 'post',
    data
  })
}

// 查询积分池详细
export function getPool(id) {
  return request({
    url: '/exchange/integralPool/getById/' + id,
    method: 'get'
  })
}

// 新增积分池
export function addPool(data) {
  return request({
    url: '/exchange/integralPool/add',
    method: 'post',
    data: data
  })
}

// 修改积分池
export function updatePool(data) {
  return request({
    url: '/exchange/integralPool/edit',
    method: 'put',
    data: data
  })
}
// 修改积分池状态
export function updatePoolStatus(data) {
  return request({
    url: '/exchange/integralPool/editStatus',
    method: 'put',
    data: data
  })
}

// 删除积分池
export function delPool(id) {
  return request({
    url: '/exchange/integralPool/remove/' + id,
    method: 'delete'
  })
}

// 积分池充值
export function recharge(integralPoolId, budgetId) {
  return request({
    url: '/exchange/integralPool/recharge',
    method: 'get',
    params: { integralPoolId, budgetId }
  })
}
// 积分池结转
export function carryForward(invalidId, notInvalidId) {
  return request({
    url: '/exchange/integralPool/carryForward',
    method: 'get',
    params: { invalidId, notInvalidId }
  })
}
