import request from '@/utils/request'

// 导航栏请求

// 获取导航栏信息
export const getFnarticle = ({ channelId, timestamp }) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params: {
      channel_id: channelId,
      timestamp,
      with_top: 1
    }
  })
}
