import Layout from '@/layout'

export default [
  {
    path: '/',
    name: '',
    redirect: '/home',
    hidden: true
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/index'),
    hidden: true
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/users/index'),
    hidden: true
  },
  {
    path: '/adminManagement',
    name: 'adminManagement',
    component: () => import('@/views/adminManagement/index'),
    hidden: true
  },
  {
    path: '/appleReceipt',
    name: 'appleReceipt',
    component: () => import('@/views/appleReceipt/index'),
    hidden: true
  },
  {
    path: '/redemptionCode',
    name: 'redemptionCode',
    component: () => import('@/views/redemptionCode/index'),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/404'], resolve),
    name: '404',
    meta: { title: '404未找到' },
    hidden: true
  }
]

