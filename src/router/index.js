import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'abologinut',
      component: () => import('@/views/login')
    },
    {
      path: '/',
      component: () => import('@/views/tabbar-layout'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/home')
        }
      ]
    }
  ]
})
