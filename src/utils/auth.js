// auth 认证的授权的
// 这里封装localStorage的方法

// 创建一个常量  存储user
const USER_KEY = 'user'

// 创建一个函数用于获取user
export const getUser = () => {
  return JSON.parse(window.localStorage.getItem(USER_KEY))
}

// 创建一个函数用于设置user
export const saveUser = (data) => {
  return window.localStorage.setItem(USER_KEY, JSON.stringify(data))
}

// 创建一个函数用于移除user
export const removeUser = () => {
  return window.localStorage.removeItem(USER_KEY)
}
