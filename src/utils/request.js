/**
 * @description 此文件用于封装Axios请求
 * @author 巫昭雯
 * @date 2020-07-24 10:45:14
 * @version V1.0
*/

import Vue from 'vue'
import axios from 'axios'
// import qs from 'qs'

import { MessageBox, Message } from 'element-ui'
import store from '@/store/index'
import { getToken } from '@/utils/auth'

// AES加密解密
import { encrypt, decrypt } from './encryption'
import * as check from './validate'

// Gzip压缩
import zlib from 'zlib'

// 全局配置
axios.defaults.baseURL = store.getters.getBasicsReqURL
axios.defaults.timeout = 5000

// create an axios instance
const service = axios.create({
  // 实例配置
  baseURL: store.getters.getBasicsReqURL, // 优先级高
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  method: 'POST',
  transformRequest: [
    // 复用原有的转换，实现json --> json string
    axios.defaults.transformRequest[0],
    function (data, header) {
      // const d = qs.stringify(data)
      if (typeof data === 'undefined') {
        return data
      }

      // 加密
      if (check.isObject(data)) {
        data = encrypt(JSON.stringify(data))
      } else {
        data = encrypt(data)
      }

      // gzip压缩

      // 如果已处理过数据，则跳过
      if (header['Content-Encoding']) {
        return data
      }

      // 如果数据长度1KB（如字符数据并不一定小于1KB），不压缩
      if (data.length < 1024) {
        return data
      }

      // 将数据压缩（可根据需要，只压缩长度大于多少的数据）
      // 设置数据类型
      header['Content-Encoding'] = 'gzip'
      const gzip = zlib.createGzip()
      gzip.end(Buffer.from(data))
      return gzip
      // return data
    }
  ],
  transformResponse: [
    function (data) {
      if (typeof data === 'string') {
        const res = decrypt(data)

        return JSON.parse(res)
      }

      return data
    }
  ]
})

console.log(axios.defaults)
console.log(service.defaults)

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    console.log('response', response)
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 2 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

Vue.prototype.$request = service

/**
 * @description 在.vue页面需要调用配置的请求时参考例子
 * @param { String } url
 * @param { Object } 对象，键名必须为data { data: data }
**/
// this.$request(url, { data: data })
