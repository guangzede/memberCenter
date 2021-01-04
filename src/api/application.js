import request from '@/utils/request'

export function getInfo(data) {
  return request({
    url: '/exchange/applicationAccount/listDataMap',
    method: 'post',
    data
  })
}
export function getListAll(data) {
  return request({
    url: '/exchange/applicationAccount/listAll',
    method: 'post',
    data
  })
}

export function selectAccountAll(data) {
  return request({
    url: '/exchange/applicationAccount/selectAccountAll',
    method: 'get',
    params: data
  })
}

export function save(data) {
  return request({
    url: '/exchange/applicationAccount/save',
    method: 'post',
    data
  })
}

export function updateState(data) {
  return request({
    url: '/exchange/applicationAccount/updateState',
    method: 'post',
    data
  })
}

export function getPoolAll(data) {
  return request({
    url: 'exchange/integralPool/notDistributionPool',
    method: 'get',
    params: data
  })
}

export function RechargeSubmit(data) {
  return request({
    url: 'exchange/applicationAccount/rechargeSubmit',
    method: 'post',
    data
  })
}

export function rechargeSubmitList(data) {
  return request({
    url: 'exchange/applicationAccount/rechargeSubmitList',
    method: 'post',
    data
  })
}

export function getUnselectedClient(data) {
  return request({
    url: '/business/selectToeClient',
    method: 'get',
    params: data
  })
}

// 查询应用账户流水列表
export function getaccountDetaiList(data) {
  return request({
    url: '/exchange/accountDetai/listDataMap',
    method: 'post',
    data
  })
}

// 获取积分兑换规则列表
export function getIntegralRatio(data) {
  return request({
    url: 'exchange/applicationAccount/getIntegralRatio',
    method: 'get',
    params: data
  })
}

// 保存积分兑换规则列表
export function saveIntegralRatio(data) {
  return request({
    url: 'exchange/applicationAccount/saveIntegralRatio',
    method: 'post',
    data
  })
}
