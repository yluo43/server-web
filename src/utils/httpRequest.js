import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'

const http = axios.create({
  timeout: 1000 * 3600,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  console.log(Vue.cookie.get('token'))
  config.headers['token'] = Vue.cookie?Vue.cookie.get('token'):null
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(undefined, (err) => {
  // 只重试一次
  const { config: originalRequest } = err
  if (
    (err?.code === 'ECONNABORTED' ||
            err?.message === 'Network Error' ||
            err?.message?.includes?.('timeout')) &&
        !originalRequest._retry
  ) {
    originalRequest._retry = true
    return axios.request(originalRequest)
  }
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if (response.data && response.data.code === 401) { // 401, token失效
    localStorage.removeItem('token');
    Vue.prototype.$message.error('用户登录信息已失效')
    router.push({ name: 'login' })
  }
  return response
}, error => {
  if (error.response) {
    if (error.response.status === 500) {
      Vue.prototype.$message.error('请求异常')
    } else if (error.response.status === 401) { // 401, token失效
      localStorage.removeItem('token');
      Vue.prototype.$message.error('用户登录信息已失效')
      router.push({ name: 'login' })
    } else if (error.response.status === 403) { // 401, token失效
      Vue.prototype.$message.error('权限不足，请申请下载~')
    } else if (error.response.status === 400) { // 400,业务异常
      console.log(error.response)
      Vue.prototype.$message.error(error.response.data.msg)
    }
  }
  console.log(error)
  return Promise.reject(error)
})

/**
 * 获取当前系统的 API 基础路径
 */
http.getSystemBaseUrl = () => {
  // 从 localStorage 获取当前选择的系统，默认为 'goalday'
  let currentSystem = localStorage.getItem('currentSystem')

  // 如果 localStorage 中没有值，初始化为 'goalday'
  if (!currentSystem) {
    currentSystem = 'goalday'
    localStorage.setItem('currentSystem', currentSystem)
  }

  // 根据系统类型返回不同的基础路径
  const systemUrls = {
    goalday: (process.env.ENV !== 'production' && process.env.VUE_APP_BASE_API ? process.env.VUE_APP_BASE_API : window.SITE_CONFIG.baseUrl),
    eggnote: (process.env.ENV !== 'production' ? '/eggnote' : 'https://api.1h3q.com:12345/eggnote'),
    'eggnote-test': (process.env.ENV !== 'production' ? '/eggnote-test' : 'http://127.0.0.1:8082/eggnote')
  }

  return systemUrls[currentSystem] || systemUrls.goalday
}

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 * @param {boolean} useSystemSwitch 是否使用系统切换（默认false，始终走GoalDay）
 */
http.adornUrl = (actionName, useSystemSwitch = false) => {
  // 默认使用 GoalDay 的地址（登录、登出、后台管理等）
  if (!useSystemSwitch) {
    return (process.env.ENV !== 'production' && process.env.VUE_APP_BASE_API ? process.env.VUE_APP_BASE_API : window.SITE_CONFIG.baseUrl) + actionName
  }

  // 根据当前选择的系统切换地址（用户数据接口）
  return http.getSystemBaseUrl() + actionName
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefaultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefaultParams = true) => {
  let defaults = {
    't': new Date().getTime()
  }
  return openDefaultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefaultData 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefaultData = true, contentType = 'json') => {
  let defaults = {
    't': new Date().getTime()
  }
  data = openDefaultData ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

http.download = (url, params = {}, localVue, fileNameOld) => {
  return http.get(url, {
    params: http.adornParams(params),
    responseType: 'arraybuffer'
  }).then(function (response) {
    let fileName = response.headers['attachment-name']
    if (fileNameOld != null) {
      fileName = fileNameOld
    }
    let contentType = response.headers['content-type']
    if (response.status === 200 && !contentType.startsWith('application/json')) {
      if (response.data.byteLength <= 1024) {
        Vue.prototype.$message.error('文件不存在')
      } else {
        // 获取自定义文件名
        // 生成Blob对象，通过创建的a标签点击下载
        let objectUrl = URL.createObjectURL(new Blob([response.data]))
        let link = document.createElement('a')
        link.download = decodeURIComponent(fileName)
        link.href = objectUrl
        link.click()
      }
    } else {
      let dataView = new DataView(response.data)
      let decoder = new TextDecoder('utf8')
      let errorMsg = (JSON.parse(decoder.decode(dataView))).msg
      localVue.$message.error(errorMsg)
    }
    return false
  }).catch(function (error) {
    return error.response.status === 403
  })
}

http.downloadPost = (url, params = {}, localVue) => {
  return http.post(url, params, { responseType: 'arraybuffer' }).then(function (response) {
    // let fileName = response.headers['filename']
    let disposition = response.headers['content-disposition']
    let array = disposition.split(';')
    let fileName
    for (let i in array) {
      let array2 = array[i].split('=')
      if (array2[0].replace(' ', '') === 'filename') {
        fileName = array2[1]
      }
    }
    let contentType = response.headers['content-type']
    if (response.status === 200 && !contentType.startsWith('application/json')) {
      if (response.data.byteLength <= 1024) {
        Vue.prototype.$message.error('不存在历史文件及内容页图片')
      } else {
        // 获取自定义文件名
        // 生成Blob对象，通过创建的a标签点击下载
        let objectUrl = URL.createObjectURL(new Blob([response.data]))
        let link = document.createElement('a')
        link.download = decodeURIComponent(fileName)
        link.href = objectUrl
        link.click()
      }
    } else {
      let dataView = new DataView(response.data)
      let decoder = new TextDecoder('utf8')
      let errorMsg = (JSON.parse(decoder.decode(dataView))).msg
      localVue.$message.error(errorMsg)
    }
    return false
  }).catch(function (error) {
    return error.response.status === 403
  })
}

export default http
