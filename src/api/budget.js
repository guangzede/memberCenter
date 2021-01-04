import request from '@/utils/request'

// 查询预算列表
export function listBudget(data) {
  return request({
    url: '/exchange/budget/list',
    method: 'post',
    data
  })
}

// 查询预算列表
export function listBudgetByRecharge(params) {
  return request({
    url: '/exchange/budget/listByRecharge',
    method: 'get',
    params
  })
}
