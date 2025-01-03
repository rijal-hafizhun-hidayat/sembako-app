import { createRouter, createWebHistory } from 'vue-router'
import LoginIndexView from '@/views/login/IndexView.vue'
import DashboardIndexView from '@/views/dashboard/IndexView.vue'
import RoleIndexView from '@/views/role/IndexView.vue'
import RoleCreateView from '@/views/role/CreateView.vue'
import RoleShowView from '@/views/role/ShowView.vue'
import CategoryIndexView from '@/views/category/IndexView.vue'
import CategoryCreateView from '@/views/category/CreateView.vue'
import CategoryShowView from '@/views/category/ShowView.vue'
import ItemIndexView from '@/views/item/IndexView.vue'
import ItemCreateView from '@/views/item/CreateView.vue'
import ItemShowView from '@/views/item/ShowView.vue'
import TransactionIndexView from '@/views/transaction/IndexView.vue'
import TransactionCreateView from '@/views/transaction/CreateView.vue'
import TransactionDetailView from '@/views/transaction/DetailView.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useAuthStore } from '@/stores/auth'
import { SweetAlert } from '@/utils/sweetalert'

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
      meta: {
        requiresAuth: true,
        requiresRoles: ['admin'],
      },
    },
    {
      path: '/role',
      children: [
        {
          path: '',
          name: 'role.index',
          component: RoleIndexView,
        },
        {
          path: 'create',
          name: 'role.create',
          component: RoleCreateView,
        },
        {
          path: ':roleId',
          name: 'role.show',
          component: RoleShowView,
        },
      ],
      meta: {
        requiresAuth: true,
        requiresRoles: ['admin'],
      },
    },
    {
      path: '/category',
      children: [
        {
          path: '',
          name: 'category.index',
          component: CategoryIndexView,
        },
        {
          path: 'create',
          name: 'category.create',
          component: CategoryCreateView,
        },
        {
          path: ':categoryId',
          name: 'category.show',
          component: CategoryShowView,
        },
      ],
      meta: {
        requiresAuth: true,
        requiresRoles: ['admin'],
      },
    },
    {
      path: '/item',
      children: [
        {
          path: '',
          name: 'item.index',
          component: ItemIndexView,
        },
        {
          path: 'create',
          name: 'item.create',
          component: ItemCreateView,
        },
        {
          path: ':itemId',
          name: 'item.show',
          component: ItemShowView,
        },
      ],
      meta: {
        requiresAuth: true,
        requiresRoles: ['admin'],
      },
    },
    {
      path: '/transaction',
      children: [
        {
          path: '',
          name: 'transaction.index',
          component: TransactionIndexView,
        },
        {
          path: 'create',
          name: 'transaction.create',
          component: TransactionCreateView,
        },
        {
          path: ':transactionId',
          name: 'transaction.detail',
          component: TransactionDetailView,
        },
      ],
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresRoles = to.meta.requiresRoles as string[] | undefined

  if (requiresAuth && !sessionStorage.getItem('token')) {
    await authStore.logout()
    SweetAlert.errorAlert('unauthorized')
    next('/')
  } else if (requiresRoles && !(await authStore.hasRoleAdmin(requiresRoles))) {
    authStore.unauthorized()
    SweetAlert.errorAlert('unauthorized')
    next('/')
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
