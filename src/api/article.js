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

// 不感兴趣传入文章ID
export const noLickContent = (id) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: id
    }
  })
}

// 拉黑作者
export const clickBlock = (id) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/blacklists',
    data: {
      target: id
    }
  })
}

// 举报文章
export const clickReport = (id, number) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/reports',
    data: {
      target: id,
      type: number,
      remark: ''
    }
  })
}
