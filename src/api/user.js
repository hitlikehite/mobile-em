// 这里写用户相关的请求函数
import request from '@/utils/request'

export const login = ({ mobile, code }) => {
  // 这里需要return出去这和函数
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}
