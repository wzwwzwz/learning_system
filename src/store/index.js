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
    userName: 'userName11==',
    userAuth: null
  },
  // 要设置的初始属性值
  count: 1
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
  isShow (state) {
    return state.showFooter
  },
  // 方法名随意,主要是用来承载变化的changableNum的值
  getChangedNum () {
    return state.changebleNum
  }
}

const mutations = {
  add (state, num) {
    state.count += num
  },

  reduce (state) {
    state.count -= 1
    state.userInfo.userName = '555'
  }
}

const actions = {
  addAction (context) {
    context.commit('add', 10)
  },

  reduceAction ({commit}) {
    commit('reduce')
  }
}

const store = new Vuex.Store({state, getters, mutations, actions})
export default store
