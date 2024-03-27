// import axios from 'axios'
//
// axios.defaults.withCredentials = true// 允许跨域携带cookie
// import { MessageBox, Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'
// import errorCode from '@/utils/errorCode'
// import { logout } from '@/api/user'
// import Vue from 'vue'
// import router from '@/router'
//
// // 创建axios实例
// const service = axios.create({
//   baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
//   // axios中请求配置有baseURL选项，表示请求URL公共部分
//   // withCredentials: true, // send cookies when cross-domain requests
//   withCredentials: true,
//   timeout: 180000 // request timeout ms
// })
//
// // request interceptor
// service.interceptors.request.use(
//   config => {
//     // do something before request is sent
//     if (store.getters.token) {
//       // let each request carry token
//       // ['X-Token'] is a custom headers key
//       // please modify it according to the actual situation
//       config.headers['X-Token'] = getToken()
//     }
//     return config
//   },
//   error => {
//     // do something with request error
//     this.$message.warning("网络异常")
//     return Promise.reject(error)
//   }
// )
// let showMsg = true
// // response interceptor
// // 响应拦截器
// service.interceptors.request.use(config => {
//   // config.headers['token'] = Vue.cookie.get('token') // 请求头带上token
//   if (config.params != null && config.params['t'] == null) {
//     config.params['t'] = new Date().getTime()
//   }
//   if (config.data != null && config.data['t'] == null) {
//     if (config.params == null) {
//       config.params = []
//     }
//     config.params['t'] = new Date().getTime()
//   }
//   let urlPrefixIndex=router.currentRoute.path.indexOf("-")
//   let autoAppend=true
//   if(config.params != null){
//     autoAppend=!(config.params['autoAppend'] === false)
//   }
//   if(urlPrefixIndex!=-1&&autoAppend){
//     config.url = router.currentRoute.path.substring(0,urlPrefixIndex)+config.url
//   }
//   // 如果存在按钮，按钮对象loading，防止重复提交
//   if (config.loadBtn) {
//     config.loadBtn.loading = true
//   }
//   return config
// }, error => {
//   console.log(error)
//   return Promise.reject(error)
// })
//
// export default service
