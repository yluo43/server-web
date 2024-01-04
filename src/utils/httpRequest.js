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
// http.interceptors.request.use(config => {
//   config.headers['token'] = Vue.cookie.get('token') // 请求头带上token
//   return config
// }, error => {
//   return Promise.reject(error)
// })

axios.interceptors.response.use(undefined, (err) => {
  // 只重试一次
  const { config: originalRequest } = err;
  if (
    (err?.code === 'ECONNABORTED' ||
      err?.message === 'Network Error' ||
      err?.message?.includes?.('timeout')) &&
    !originalRequest._retry
  ) {
    originalRequest._retry = true;
    return axios.request(originalRequest);
  }
});

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if (response.data && response.data.code === 401) { // 401, token失效
    Vue.prototype.$message.error('用户登录信息已失效')
    router.push({ name: 'login' })
  }
  return response
}, error => {
  if(error.response) {
    if (error.response.status === 500) {
      Vue.prototype.$message.error('请求异常')
    } else if (error.response.status === 401) { // 401, token失效
      Vue.prototype.$message.error('用户登录信息已失效')
      router.push({name: 'login'})
    } else if (error.response.status === 403) { // 401, token失效
      Vue.prototype.$message.error('权限不足，请申请下载~')
    }
  }
  console.log(error)
  return Promise.reject(error)
})



/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.ENV !== 'production' && process.env.VUE_APP_BASE_API ? process.env.VUE_APP_BASE_API: window.SITE_CONFIG.baseUrl) + actionName
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefaultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefaultParams = true) => {
  var defaults = {
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
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefaultData ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

http.download = (url, params = {}, localVue) => {
  return http.get(url, {
    params: http.adornParams(params),
    responseType: 'arraybuffer'
  }).then(function (response) {
    var fileName = response.headers['attachment-name']
    var contentType = response.headers['content-type']
    if (response.status === 200 && !contentType.startsWith('application/json')) {
      if(response.data.byteLength<=1024){
        Vue.prototype.$message.error('文件不存在')
      }else {
        // 获取自定义文件名
        // 生成Blob对象，通过创建的a标签点击下载
        var objectUrl = URL.createObjectURL(new Blob([response.data]))
        var link = document.createElement('a')
        link.download = decodeURIComponent(fileName)
        link.href = objectUrl
        link.click()
      }
    } else {
      var dataView = new DataView(response.data)
      var decoder = new TextDecoder('utf8')
      var errormsg = (JSON.parse(decoder.decode(dataView))).msg
      localVue.$message.error(errormsg)
    }
    return false
  }).catch(function (error) {
    if (error.response.status === 403) {
      return true
    } else {
      return false
    }
  })
}

http.downloadPost = (url, params = {}, localVue) => {
   return http.post(url, params,{responseType: 'arraybuffer'}).then(function(response) {
    // let fileName = response.headers['filename']
    let disposition = response.headers['content-disposition']
    let array = disposition.split(';')
    let fileName = undefined
    for(let i  in array){
        let array2 = array[i].split('=')
        if(array2[0].replace(' ','') === 'filename'){
          fileName = array2[1]
        }
    }
    var contentType = response.headers['content-type']
    if (response.status === 200 && !contentType.startsWith('application/json')) {
      if(response.data.byteLength<=1024){
        Vue.prototype.$message.error('不存在历史文件及内容页图片')
      }else {
        // 获取自定义文件名
        // 生成Blob对象，通过创建的a标签点击下载
        var objectUrl = URL.createObjectURL(new Blob([response.data]))
        var link = document.createElement('a')
        link.download = decodeURIComponent(fileName)
        link.href = objectUrl
        link.click()
      }
    } else {
      var dataView = new DataView(response.data)
      var decoder = new TextDecoder('utf8')
      var errormsg = (JSON.parse(decoder.decode(dataView))).msg
      localVue.$message.error(errormsg)
    }
    return false
  }).catch(function(error) {
    if(error.response.status===403){
      return true
    }else {
      return false
    }
  })
}

export default http
