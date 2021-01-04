import request from '@/utils/request'

export function getMemberActiveInfo(data) {
  return request({
    url: '/kpi/getMemberActiveInfo',
    method: 'post',
    data: data
  })
}

export function getIntegralChangeInfo(data) {
  return request({
    url: '/kpi/getIntegralChangeInfo',
    method: 'post',
    data: data
  })
}

export function getMemberAddInfo(data) {
  return request({
    url: '/kpi/getMemberAddInfo',
    method: 'post',
    data: data
  })
}
