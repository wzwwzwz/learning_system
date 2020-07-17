import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

// import {mapGetters} from 'vuex'
import Store from '@/store/index'
// import { existPath } from '@/utils/index'

// 引入页面组件
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import HomeIndex from '@/pages/HomeIndex'
import Exam from '@/pages/Exam'
import NotFound from '@/pages/NotFound'
import examQueDialog from '@/components/common/examQueDialog'
import testPage from '@/components/testPage'
import myAudit from '@/pages/personal/myAudit/AuditIndex'
import QueIndex from '@/pages/question/QueIndex'

// 学习纲目
import learnDirIndex from '@/pages/learnDir/index'
import Issue from '@/pages/learnDir/Issue'
import DetailsAnswer from '@/pages/learnDir/DetailsAnswer'

// 系统管理
import systemIndex from '@/pages/system/systemIndex'
import businessManagement from '@/pages/system/businessManagement'
import AuthManage from '@/pages/system/AuthManage'
import Organization from '@/pages/system/Organization'

Vue.use(Router)

// 解决重复点击菜单报错
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

let routes = [
  // {path: '/',name: 'HelloWorld',component: HelloWorld},
  {
    path: '/',
    name: 'Home',
    component: Home,
    // redirect: '/index',
    children: [
      { path: '/', name: 'HomeIndex', component: HomeIndex },
      // 学习纲目
      { path: '/learnDir',
        name: 'learnDirIndex',
        component: learnDirIndex,
        redirect: '/learnDir/index',
        children: [
          { path: '/learnDir/index', name: 'learnDir', component: Issue },
          { path: '/learnDir/DetailsAnswer', name: 'DetailsAnswer', component: DetailsAnswer }
        ]
      },
      {path: '/question', name: 'question', component: QueIndex},
      {path: '/exam', name: 'Exam', component: Exam},
      // 系统管理
      { path: '/system',
        name: 'system',
        component: systemIndex,
        redirect: '/system',
        children: [
          {path: '/department', name: 'businessManagement', component: businessManagement},
          {path: '/system', name: 'AuthManage', component: AuthManage},
          {path: '/organization', name: 'Organization', component: Organization}
        ]
      },
      // 测试页：二级页面
      {path: '/test', name: 'test', component: examQueDialog},
      {path: '/myAudit', name: 'myAudit', component: myAudit}
    ]
  },
  {path: '/login', name: 'Login', component: Login},
  {path: '/404', name: 'NotFound', component: NotFound},
  /* 路由重定向，当用户搜索不到页面时，默认跳转到指定页面 */
  {path: '*', redirect: '/404'},
  // 测试页：布局
  {path: '/0', name: 'testPage', component: testPage}
]

const router = new Router({
  routes,
  // 删掉锚点(#号键)
  mode: 'history'
})

// 全局守卫
router.beforeEach((to, from, next) => {
  // if (!existPath(routes, to.path)) {
  //   next('/404')
  //   return
  // }

  if (from.path === '/Exam') {
    const gettersVuex = Store.getters.getExamStatus

    // console.log(Store)

    if (gettersVuex) {
      next(false)
      return
    }
  }

  if (to.path === '/myAudit') {
    const userAuth = Store.getters.getUserInfo.userAuth
    // console.log(routes)

    if (userAuth !== 2) {
      next('/404')
      return
    }
  }

  next()
})

export default router
