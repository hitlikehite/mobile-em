import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant, { Lazyload } from 'vant'
import 'amfe-flexible'
import 'vant/lib/index.css'
import './styles/index.less'
import dayjs from 'dayjs' // 时间包
import relativeTime from 'dayjs/plugin/relativeTime' // dayjs 的 相对时间插件
import 'dayjs/locale/zh-cn' // 注册中文包
dayjs.locale('zh-cn')
dayjs.extend(relativeTime) // 把插件注册到 dayjs 中

Vue.filter('relativeTime', value => {
  return dayjs().from(value)
})

Vue.use(Vant)
Vue.use(Lazyload)

Vue.config.productionTip = false

Vue.prototype.$sleep = time => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, time)
  })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
