import request from '@/utils/request'

// 查询积分池流水列表
export function listDetail(data) {
  return request({
    url: '/exchange/integralPoolDetail/list',
    method: 'post',
    data
  })
}

// 根据积分池id查询所有应用账户和充值的金额
export function getAppAccountByPoolId(poolId) {
  return request({
    url: '/exchange/integralPoolDetail/getAppAccountByPoolId',
    method: 'get',
    params: { poolId }
  })
}

