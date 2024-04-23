import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import './assets/icon/iconfont.css'

import App from './App'
import store from '@/store'
import router from './router'
import * as echarts from 'echarts'
import { hasPermission } from '@/utils/common'

// import VueCookie from 'vue-cookie'
import './assets/icon/iconfont.css'

import '@/icons' // icon

import Vue2OrgTree from 'vue2-org-tree'
import 'vue2-org-tree/dist/style.css'

import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios

import hasButton from '@/utils/hasButton'
// 判断按钮权限
Vue.directive('auth', hasButton)
Vue.prototype.hasPermission = hasPermission

Vue.use(Vue2OrgTree)
// Vue.use(VueCookie)

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.directive('alterELDialogMarginTop' /*修改elementUI中el-dialog顶部的距离*/, {
  inserted(el, binding, vnode) {
    el.firstElementChild.style.marginTop = binding.value.marginTop
  }
})

//el-select框懒加载-监管副总裁
Vue.directive('loadMore', {
  bind(el, binding) {
    // 获取element，定义scroll
    let select_dom = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
    select_dom.addEventListener('scroll', function () {
      let height = this.scrollHeight - this.scrollTop <= this.clientHeight
      if (height) {
        binding.value()
      }
    })
  }
})

//el-select框懒加载-项目助理
Vue.directive('loadMoreAssistant', {
  bind(el, binding) {
    // 获取element，定义scroll
    let select_dom = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
    select_dom.addEventListener('scroll', function () {
      let height = this.scrollHeight - this.scrollTop <= this.clientHeight
      if (height) {
        binding.value()
      }
    })
  }
})
Vue.directive('dialogDrag', {
  bind(el, binding, vnode) {}
})
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: 'success' })
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: 'error' })
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg)
}
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

Vue.prototype.$axios = axios

/**
 if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
 **/

// set ElementUI lang to EN
//Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  axios,
  httpRequest,
  render: (h) => h(App)
})
