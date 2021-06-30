/**
 * @description 此文件用于封装Axios请求
 * @author WZW
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
import { encrypt, decrypt, ungzip, gzip } from './encryption'
import * as check from './validate'

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
  headers: {
    'Content-Type': 'text/plain;charset=utf-8'
    // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  transformRequest: [
    // 复用原有的转换，实现json --> json string
    axios.defaults.transformRequest[0],
    function (data, header) {
      // data = qs.stringify(data)
      // data = JSON.stringify(data)

      if (typeof data === 'undefined') {
        return data
      }

      // 加密
      if (check.isObject(data)) {
        data = encrypt(JSON.stringify(data))
      } else {
        data = encrypt(data)
      }

      // 如果已处理过数据，则跳过
      if (header['Content-Encoding']) {
        return data
      }

      // 如果数据长度1KB（如字符数据并不一定小于1KB），不压缩
      if (data.length < 1024) {
        // return data
      }

      // 将数据压缩（可根据需要，只压缩长度大于多少的数据）
      // 设置数据类型
      header['Content-Encoding'] = 'gzip,deflate'

      // console.log(data)

      return gzip(data)
    }
  ],
  transformResponse: [
    function (data, header) {
      let res = data

      if (res.trim() !== '' && check.isString(res)) {
        header['Content-Encoding'] = 'gzip'

        // 解压
        res = ungzip(data)

        // 解密
        res = decrypt(res)

        // 转化为对象
        return JSON.parse(res)
      }

      return res
    }
  ]
})

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
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    // console.log('response', response)

    if (response.status !== 200) {
      return Promise.reject(new Error(response.message || 'Error'))
    }

    const res = response.data

    if (Number(res.CODE) === 200) {
      return res
    }

    Message({
      message: res.message || 'Error',
      type: 'error',
      duration: 2 * 1000
    })

    // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    if (res.CODE === 50008 || res.CODE === 50012 || res.CODE === 50014) {
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
  },
  error => {
    // console.log('err' + error) // for debug
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
