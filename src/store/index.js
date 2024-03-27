import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import VueFileAgent from 'vue-file-agent' //拖拽上传文件
import permission from './modules/permission'
import VueTippy, { TippyComponent } from "vue-tippy"; //提示框插件

import cloneDeep from 'lodash/cloneDeep'

Vue.use(Vuex);
Vue.use(VueFileAgent);
Vue.use(VueTippy);

Vue.component("tippy", TippyComponent); //提示插件组件全局设置 <tippy>

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    permission
  },
  getters,
  mutations: {
    // 重置vuex本地储存状态
    resetStore(state) {
      Object.keys(state).forEach((key) => {
        state[key] = cloneDeep(window.SITE_CONFIG['storeState'][key])
      })
    }
  },
})

export default store
