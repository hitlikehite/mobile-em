import axios from 'axios'
import store from '@/store'
import JSONbig from 'json-bigint'

// 创建一个axios对象，名为request
const request = axios.create({
  // baseURL: 'http://toutiao.course.itcast.cn'
  baseURL: 'http://ttapi.research.itcast.cn/'
})

request.defaults.transformResponse = [function (data) {
  try {
    // data 数据可能不是标准的 JSON 格式字符串，否则会导致 JSONbig.parse(data) 转换失败报错
    return JSONbig.parse(data)
  } catch (err) {
    // 无法转换的数据直接原样返回
    return data
  }
}]

// 请求拦截器，处理请求数据（请求体）
request.interceptors.request.use(function (config) {
  if (store.state.user) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, function (error) {
  // 有错误在这里输出错误
  return Promise.reject(error) // 错误返回一个promise错误
})

// 响应拦截器，处理返回的数据
request.interceptors.response.use(function (response) {
  // 如果有返回的数据有respose.data.data则返回respose.data.data
  // 如果返回的数据没有respose.data.data则返回respose.data
  return response.data.data || response.data
}, function (error) {
  // 有错误在这里输出错误
  return Promise.reject(error)
})

// 向外提供一个request对象
export default request
