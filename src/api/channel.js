import request from '@/utils/request'

// 导航栏请求

// 获取导航栏信息
export const getFnChannel = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

// 获取总文章列表
export const getFnChannelAll = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}

// 修改用户频道
export const updateChannelAll = (data) => {
  return request({
    method: 'PUT',
    url: '/app/v1_0/user/channels',
    data: {
      channels: data
    }
  })
}
