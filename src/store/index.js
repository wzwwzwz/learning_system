import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 要设置的全局访问的state对象
const state = {
  token: '',
  // 基本请求地址
  basicsReqURL: 'http://192.168.1.41:8000',
  // 用户信息
  userInfo: {
    userId: 111,
    userName: 'userName11==',
    userAuth: null
    // userAuth: 'admin'
  },
  // 要设置的初始属性值
  count: 1,
  bIsExam: false,
  knowledgePoint: [{
    name: '业内名词',
    label: '业内名词'
  }, {
    name: '公司内部名词',
    label: '公司内部名词'
  }, {
    name: '行业产品',
    label: '行业产品'
  }, {
    name: '公司产品',
    label: '公司产品'
  }, {
    name: '产品应用场景',
    label: '产品应用场景'
  }, {
    name: '产品目的',
    label: '产品目的'
  }]
}

// 实时监听state值的变化(最新状态)
const getters = {
  // getters 写法一
  getUserInfo () {
    return state.userInfo
  },
  // getters 写法二
  getCount: (state) => state.count,
  getBasicsReqURL: (state) => state.basicsReqURL,
  getKnowledgePoint: state => state.knowledgePoint,
  getExamStatus: state => state.bIsExam
}

// 该方法接受第一个参数接受 state作为上下文
const mutations = {
  add (state, num) {
    state.count += num
  },
  reduce (state) {
    state.count -= 1
    state.userInfo.userName = '555'
  },
  uploadHead (state, param) {
    console.log('mutations上传头像', param.get('multfile'))
    // commit('上传头像', param)
  },
  setExamStatus (state, b) {
    if (typeof b !== 'boolean') {
      return false
    }
    state.bIsExam = b
  }
}

// 可以实现异步
const actions = {
  addAction (context) {
    context.commit('add', 10)
  },

  reduceAction ({commit}) {
    commit('reduce')
  },
  // 上传头像
  UPLOAD_HEAD ({commit}, param) {
    console.log('actions上传头像')
    commit('uploadHead', param)
  },
  setExamStatus ({commit}, param) {
    commit('setExamStatus', param)
  }
}

const store = new Vuex.Store({state, getters, mutations, actions})
export default store
