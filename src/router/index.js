import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

// import {mapGetters} from 'vuex'
import Store from '@/store/index'

// 引入页面组件
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import homeIndex from '@/pages/homeIndex'
// import learnDir from '@/pages/learnDir/learnDir'
import learnDirIndex from '@/pages/learnDir/index'
// import detailsAnswer from '@/pages/learnDir/detailsAnswer'
import exam from '@/pages/exam'
import authManage from '@/pages/authManage'
import notFound from '@/pages/notFound'
import examQueDialog from '@/components/common/examQueDialog'
import testPage from '@/components/testPage'
import myAudit from '@/pages/personalManagement/myAudit/auditIndex'

Vue.use(Router)

// 解决重复点击菜单报错
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  routes: [
    // {path: '/',name: 'HelloWorld',component: HelloWorld},
    {
      path: '/',
      name: 'Home',
      component: Home,
      // redirect: '/index',
      children: [
        { path: '/', name: 'homeIndex', component: homeIndex },
        { path: '/learnDir',
          name: 'learnDir',
          component: learnDirIndex,
          children: [
            // {path: '', name: 'learnDir', component: learnDir},
            // {path: '', name: 'detailsAnswer', component: detailsAnswer}
          ]
        },
        {path: '/exam', name: 'exam', component: exam},
        {path: '/authManage', name: 'authManage', component: authManage},
        // 测试页：二级页面
        {path: '/test', name: 'test', component: examQueDialog},
        {path: '/myAudit', name: 'myAudit', component: myAudit}
      ]
    },
    {path: '/login', name: 'Login', component: Login},
    {path: '/404', name: 'notFound', component: notFound},
    /* 路由重定向，当用户搜索不到页面时，默认跳转到指定页面 */
    {path: '*', redirect: '/'},
    // 测试页：布局
    {path: '/0', name: 'testPage', component: testPage}
  ],
  // 删掉锚点(#号键)
  mode: 'history'
})

// 全局守卫
router.beforeEach((ro, from, next) => {
  if (from.path === '/exam') {
    const gettersVuex = Store.getters.getExamStatus

    console.log(Store)

    if (gettersVuex) {
      next(false)
      return
    }
  }
  next()
})

export default router
