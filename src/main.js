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

// 引入富文本编辑器
// import VueQuillEditor from 'vue-quill-editor'
// // require styles 引入样式； 富文本编辑器外部引用样式  三种样式三选一引入即可
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

// global css
import '@/styles/index.css'
import './icons'

// 全局配置axios
Vue.prototype.axios = axios
Vue.prototype.qs = QS
Vue.config.productionTip = false

// 使用element-ui
Vue.use(ElementUI)
// Vue.use(VueQuillEditor)

// register globally
// Vue.component('svg-icon', SvgIcon)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
