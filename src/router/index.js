import Vue from 'vue'
import Router from 'vue-router'
import systemRouters from './system/system'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// 公共路由
export const constantRoutes = [
  ...systemRouters
]

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
  base: '/'
})

router.beforeEach((to, from, next) => {
  // 简化路由守卫，直接放行所有路由
  // 如果需要登录验证，可以在这里添加
  next()
})

// 移除动态路由功能，因为我们不再使用 modules 目录
// export function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
//   ... 已删除
// }

// 移除路由类型判断函数
// function fnCurrentRouteType (route, globalRoutes = []) {
//   ... 已删除
// }

router.afterEach(() => {
  // finish progress bar
  // NProgress.done()
})

export default router
