import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'homepage-view',
      component: () => import('@/views/homepage/index.vue')
    },
    {
      path: '/login',
      name: 'login-view',
      component: () => import('@/views/login/index.vue')
    }

  ]
})

export default router
