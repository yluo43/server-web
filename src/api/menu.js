import request from '@/utils/request'

// 查询左侧菜单
export function getRouters() {
  return request({
    url: 'getRouters/',
    method: 'get'
  })
}



