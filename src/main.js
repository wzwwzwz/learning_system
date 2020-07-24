// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入store
import store from './store'

// 引入axios
import axios from 'axios'
import QS from 'qs'
// 封装请求函数
import './utils/request.js'

// 全局引用
// 过滤器
import filters from './utils/filters.js'
// 数据处理
import dataProcess from './utils/data-process.js'

// global css
import '@/styles/index.css'
import './icons'

// 全局配置axios
Vue.prototype.axios = axios
Vue.prototype.qs = QS
Vue.config.productionTip = false
Vue.prototype.$dataProcess = dataProcess

// 使用element-ui
Vue.use(ElementUI)

// register globally
// Vue.component('svg-icon', SvgIcon)

Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
