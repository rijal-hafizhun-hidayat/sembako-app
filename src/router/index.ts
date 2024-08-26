import { createRouter, createWebHistory } from 'vue-router'
import LoginIndexView from '@/views/login/IndexView.vue'
//import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login.index',
      component: LoginIndexView
    }
  ]
})

export default router
