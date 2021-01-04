import request from '@/utils/request'

export function queryjob(data) {
  return request({
    url: '/quartzJob/queryjob',
    method: 'get',
    params: data
  })
}
export function pausejob(data) {
  return request({
    url: '/quartzJob/pausejob',
    method: 'post',
    data: data
  })
}
export function resumejob(data) {
  return request({
    url: '/quartzJob/resumejob',
    method: 'post',
    data: data
  })
}
export function deletejob(data) {
  return request({
    url: '/quartzJob/deletejob',
    method: 'post',
    data: data
  })
}
export function reschedulejob(data) {
  return request({
    url: '/quartzJob/reschedulejob',
    method: 'post',
    data: data
  })
}
export function addjob(data) {
  return request({
    url: '/quartzJob/addjob',
    method: 'post',
    data: data
  })
}
