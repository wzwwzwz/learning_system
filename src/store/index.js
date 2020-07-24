import Vue from 'vue'
import Vuex from 'vuex'

// 测试文件
import { TestBack } from '@/utils/testFiles/testBank'

Vue.use(Vuex)

// 要设置的全局访问的state对象
const state = {
  token: '',
  // 基本请求地址
  basicsReqURL: 'http://192.168.1.41:8080',
  // 用户信息
  userInfo: {
    userId: 111,
    userName: '==userName11==',
    // userAuth: 'admin'
    // 1 === 管理员；2 === 评审员 ; 3 === 普通用户
    userAuth: 2,
    // 本周是否 已考试
    bWeekExam: false
  },
  // 要设置的初始属性值
  count: 1,
  // 是否正在考试中
  bIsExam: false,
  // 知识点
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
  }],
  // arrQusLevel: ['简单', '中等', '困难'],
  arrQusLevel: [
    {
      key: 1,
      val: '简单'
    },
    {
      key: 2,
      val: '中等'
    },
    {
      key: 3,
      val: '困难'
    }
  ],
  // 用户分类数组
  arrUserType: [
    {
      idx: 1,
      val: '管理员'
    },
    {
      idx: 2,
      val: '评审员'
    },
    {
      idx: 3,
      val: '普通用户'
    }
  ],
  // 性别数组
  arrGender: [
    {
      name: 0,
      label: '女'
    },
    {
      name: 1,
      label: '男'
    }
  ],
  // 测试 保存出题
  classTestBank: new TestBack()
}

// 实时监听state值的变化(最新状态)
const getters = {
  getToken: state => state.token,
  getUserInfo: (state) => state.userInfo,
  getCount: (state) => state.count,
  getBasicsReqURL: (state) => state.basicsReqURL,
  getKnowledgePoint: state => state.knowledgePoint,
  getExamStatus: state => state.bIsExam,
  getArrQusLevel: state => state.arrQusLevel,
  getArrUserType: state => state.arrUserType,
  getArrGender: state => state.arrGender,
  // 获取题库对象 (测试)
  getClassTestBank: state => state.classTestBank
}

// 该方法接受第一个参数接受 state作为上下文
const mutations = {
  setToken (state, str) {
    state.token = str
  },
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
  },
  // 设置用户本周是否已考试
  setUserWeekExam (state, b) {
    if (typeof b !== 'boolean') {
      return false
    }
    state.userInfo.bWeekExam = b
  },
  // 测试题库类
  testBackAdd (state, data) {
    state.classTestBank.add(data)
  }
}

// 可以实现异步
const actions = {
  setToken ({commit}, str) {
    commit('setToken', str)
  },
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
  },
  // 获取用户的考试列表
  getUserExams ({commit}, param) {},
  // 测试
  classTestBankAdd ({commit}, param) {
    commit('testBackAdd', param)
  }

}

const store = new Vuex.Store({state, getters, mutations, actions})
export default store
