import request from '@/utils/request'

// 模糊搜索
export const textVague = text => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q: text
    }
  })
}
