import Vue from 'vue'
import Router from 'vue-router'
import Store from '@/store/index'

// 引入页面组件
const HomeIndex = () => import('@/pages/HomeIndex')
const NotFound = () => import('@/pages/NotFound')
const Login = () => import('@/pages/Login')
const Home = () => import('@/pages/Home')
const Exam = () => import('@/pages/Exam')
const myAudit = () => import('@/pages/personal/myAudit/AuditIndex')
const QueIndex = () => import('@/pages/question/QueIndex')
// 测试组件
const testPage = () => import('@/components/testPage')

// 学习纲目
const learnDirIndex = () => import(/* webpackChunkName:'learnPackage' */ '@/pages/learnDir/index')
const Issue = () => import(/* webpackChunkName:'learnPackage' */ '@/pages/learnDir/Issue')
const DetailsAnswer = () => import(/* webpackChunkName:'learnPackage' */ '@/pages/learnDir/DetailsAnswer')

// 系统管理
const SystemIndex = () => import(/* webpackChunkName:'systemPackage' */ '@/pages/system/SystemIndex')
const Company = () => import(/* webpackChunkName:'systemPackage' */ '@/pages/system/Company')
const User = () => import(/* webpackChunkName:'systemPackage' */ '@/pages/system/User')
const Organization = () => import(/* webpackChunkName:'systemPackage' */ '@/pages/system/Organization')
const Privilege = () => import(/* webpackChunkName:'systemPackage' */ '@/pages/system/Privilege')

Vue.use(Router)

// 解决重复点击菜单报错
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

let routes = [
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
        component: SystemIndex,
        redirect: '/company',
        children: [
          {path: '/company', name: 'Company', component: Company},
          {path: '/user', name: 'User', component: User},
          {path: '/organization', name: 'organization', component: Organization},
          {path: '/privilege', name: 'Privilege', component: Privilege}
        ]
      },
      // 测试页：二级页面
      {path: '/test', name: 'test', component: testPage},
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
