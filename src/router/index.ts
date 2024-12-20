import { createRouter, createWebHistory } from 'vue-router'
import LoginIndexView from '@/views/login/IndexView.vue'
import DashboardIndexView from '@/views/dashboard/IndexView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login.index',
      component: LoginIndexView,
    },
    {
      path: '/dashboard',
      name: 'dashboard.index',
      component: DashboardIndexView,
    },
  ],
})

export default router
