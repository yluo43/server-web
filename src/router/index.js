import Vue from 'vue'
import Router from 'vue-router'
import systemRouters from './system/system'
import Layout from '@/layout'
import httpRequest from '@/utils/httpRequest'

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
//公共路由
export const constantRoutes = [
  ...systemRouters
]


const router =  new Router({
  // mode: 'history', // require service support
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: constantRoutes,
  base: '/'   //路由中的前缀
})


// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomm ent-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

const whiteList = [
  { path: '/login', component: '@/views/login', name: 'login', meta: { title: '登录' } }
] // no redirect whitelist   [登录,下载输出文件]列为白名单

router.beforeEach((to, from, next) => {
  // start progress bar
  // NProgress.start()
  // set page title
  // document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in

  // if(!hasToken) {
  //   router.push({ name: 'login' })
  // }
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, whiteList) === 'global') {
    next()
  } else {
    next()
    httpRequest({
      url:httpRequest.adornUrl('/userInfo/menu'),
      method: 'get',
    }).then(({data}) => {
      if (data && data.code === 200) {
          // if(!getMenu()) {
            fnAddDynamicMenuRoutes(data.payload.menuList)
        localStorage.setItem('buttons', JSON.stringify(data.payload.permissions || '[]'))
        // setMenu()
          // }
          router.options.isAddDynamicMenuRoutes = true

        // sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
        next({ ...to, replace: true })
      } else {
        sessionStorage.setItem('menuList', '[]')
        sessionStorage.setItem('permissions', '[]')
        router.push({ name: 'login' })
      }
    }).catch((e) => {
      router.push({ name: 'login' })
    })
  }
})



export function fnAddDynamicMenuRoutes (menuList = [], routes = []) {

  for (var i = 0; i < menuList.length; i++) {
    menuList[i].url = menuList[i].url.replace(/^\//, '')
    let children = []
    for (var j = 0; j < menuList[i].sons.length; j++) {
      let location = menuList[i].sons[j].location;
      var routeSon = {
        path: menuList[i].sons[j].url,
        component: (resolve) => require([`@/views/modules/${location}`], resolve),
        name:  menuList[i].sons[j].ename,
        hidden: false,
        meta: {
          menuId: menuList[i].sons[j].menuId,
          title: menuList[i].sons[j].menuName,
        }
      }
      children.push(routeSon)
    }
    var route = {
      path: menuList[i].url,
      component: Layout,
      name:  menuList[i].ename.replace(/\//g, '-'),
      children: children,
      icon: 'el-icon-'+menuList[i].icon,
      hidden: false,
      meta: {
        menuId: menuList[i].menuId,
        title: menuList[i].menuName,
      }
    }
    routes.push(route)
  }

  router.options.routes = systemRouters.concat(routes)
  router.matcher = new Router().matcher //match
  router.addRoutes(router.options.routes)
  console.log(router)
  // router.addRoutes(
  //   routes)
  // router.addRoutes(
  //   [{ path: '*', redirect: { name: '404' }}])
}



function fnCurrentRouteType (route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

router.afterEach(() => {
  // finish progress bar
  // NProgress.done()
})

export default router
