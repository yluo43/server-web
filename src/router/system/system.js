import Layout from '@/layout'

export default [
  {
    path: '/',
    name: '',
    redirect: '/login',
    hidden: true
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/office',
    name: 'office',
    component: () => import('@/views/modules/common/office'),
    hidden: true
  },
  {
    path: '/index123',
    component: Layout,
    name:  'index',
    children: [{
      path: '/index',
      component: (resolve) => require([`@/views/modules/index`], resolve),
      name:  'index1',
      hidden: true,
      meta: {
        menuId: 123,
        title: '首页',
      }
    }],
    hidden: true,
    meta: {
      menuId: '321',
      title: '首页'
    }},
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    meta: { title: '用户信息', icon: 'user' },
    children: [
      {
        path: 'resetPwd',
        name: 'ResetPwd',
        component: (resolve) => require(['@/views/user/resetPwd'], resolve),
        meta: { title: '修改密码', icon: 'user' }
      }
    ]
  },
  { path: '/404', component: (resolve) => require(['@/views/404'], resolve), name: '404', meta: { title: '404未找到' }, hidden: true },

]
