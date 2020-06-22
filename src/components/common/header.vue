<template>
  <div id="hearder" class="ls_main_content">
    <!-- 菜单 -->
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" :router="b_router">
      <!-- 主页 -->
      <el-menu-item index="/">主页</el-menu-item>
      <div class="icon_wrap btn_home" @click="gotohome">
        <!-- <i class="el-icon-s-home btn_user_icon" size="medium"></i> -->
        <i class="el-icon-s-home"></i>
      </div>

      <!-- index === 作为路由path值跳转 -->
      <!-- <el-menu-item index="learnDir" >学习纲目</el-menu-item> -->
      <!-- <el-menu-item index="2" >题库</el-menu-item> -->
      <!-- <el-menu-item index="exam">考试</el-menu-item>
      <el-menu-item index="authManage">用户</el-menu-item> -->

      <template v-for="item in arr_menu">
        <el-menu-item :index="item.path" v-html="item.val" :key="item.path"></el-menu-item>
      </template>

      <!-- 出题 -->
      <div class="btn_user btn_editQus">
        <el-button type="text" style="height: 100%;">出题</el-button>
      </div>

      <!-- 消息 -->
      <div class="btn_user btn_msg">
        <el-badge :hidden="o_msg.b_new_msg" :value="o_msg.msg_num" class="btn_user_icon">
          <i class="el-icon-message-solid" size="medium"></i>
        </el-badge>
      </div>

      <!-- 头像下拉菜单 -->
      <el-dropdown trigger="click" class="btn_user" @command="handleCommand">
        <span class="el-dropdown-link">
          <!-- 头像 -->
          <el-avatar icon="el-icon-user-solid" class="btn_user_icon"></el-avatar>
          <!-- 下拉菜单 -->
          <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-chat-dot-square" command="my_msg">我的评论</el-dropdown-item>
          <el-dropdown-item icon="el-icon-notebook-1" command="my_exam_que">我的题目</el-dropdown-item>
          <el-dropdown-item icon="el-icon-document" command="my_exam">我的考试</el-dropdown-item>
          <div class="g_spilt_div_Horizontal"></div>
          <el-dropdown-item icon="el-icon-circle-close" command="sign_out">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu>

    <!-- 测试vuex -->
    <div v-show="false">
      <div>mapState 获取userInfo{{getUserInfo.userName}}</div>
      <div>$store.state 获取{{ $store.state.count }}</div>
      <div>mapGetters 获取{{getCount}}</div>
      <div>{{ $store.state.userInfo.userName }}</div>
      <div>{{ $store.state.changableNum }}</div>
      <!-- <el-button @click="$store.commit('add')">+</el-button> -->
      <el-button @click="add(2)">+</el-button>
      <el-button @click="$store.commit('reduce')">-</el-button>
      <!-- Action -->
      <el-button @click="addAction">Action+</el-button>
      <el-button @click="reduceAction">Action-</el-button>
      <div>getBasicsReqURL {{getBasicsReqURL}}</div>
    </div>
  </div>
</template>

<script>
// import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  data () {
    return {
      // activeIndex: '/',
      b_router: true,
      // isCollapse: true
      // 消息对象
      o_msg: {
        b_new_msg: true,
        msg_num: 12
      },
      // 菜单数组
      arr_menu: [{
        path: '/learnDir',
        val: '学习纲目'
      },
      {
        path: '/255',
        val: '题库'
      }, {
        path: '/exam',
        val: '考试'
      },
      {
        path: '/authManage',
        val: '用户'
      }
      ]
    }
  },
  created () {
    // this.realName = sessionStorage.getItem("realName");
    let url = `${this.getBasicsReqURL}/system/role/updateRole`
    console.log('urlurlurlurlurlurlurlurlurl', url)
  },
  computed: {
    // 用mapGetters获取vuex state状态
    ...mapGetters(['getUserInfo', 'getBasicsReqURL', 'getCount']),
    activeIndex () {
      // console.log(this.$route.path)
      return this.$route.path
    }
  },
  methods: {
    // 添加vuex状态函数
    ...mapMutations(['add', 'reduce']),
    ...mapActions(['addAction', 'reduceAction']),
    gotohome () {
      this.$router.push({
        name: 'Home'
      })
    },
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
      // this.activeIndex = key
    },
    handleCommand (command) {
      this.$message('click on item ' + command)
      const vm = this
      if (command === 'sign_out') {
        this.$confirm('确认退出吗?', '提示', {
          type: 'warning'
        })
          .then(() => {
            sessionStorage.clear()
            vm.$router.push('/login')
          })
          .catch(() => { })
      }
      if (command === 'pwd') {
        // vm.$router.push("/personalSet/passwordReset");
      }
      if (command === 'msg') {
        // vm.$router.push("/personalSet/personManagement");
      }
    },
    // collapseChage() {
    //   this.collapse = !this.collapse;
    //   bus.$emit("collapse", this.collapse);
    // },
    // 全屏
    handleFullScreen () {
      // let element = document.documentElement;
      // if (this.fullscreen) {
      //   if (document.exitFullscreen) {
      //     document.exitFullscreen();
      //   } else if (document.webkitCancelFullScreen) {
      //     document.webkitCancelFullScreen();
      //   } else if (document.mozCancelFullScreen) {
      //     document.mozCancelFullScreen();
      //   } else if (document.msExitFullscreen) {
      //     document.msExitFullscreen();
      //   }
      // } else {
      //   if (element.requestFullscreen) {
      //     element.requestFullscreen();
      //   } else if (element.webkitRequestFullScreen) {
      //     element.webkitRequestFullScreen();
      //   } else if (element.mozRequestFullScreen) {
      //     element.mozRequestFullScreen();
      //   } else if (element.msRequestFullscreen) {
      //     // IE11
      //     element.msRequestFullscreen();
      //   }
      // }
      // this.fullscreen = !this.fullscreen;
    },
    mounted () {
      if (document.body.clientWidth < 1500) {
        this.collapseChage()
      }
    }
  }
}

</script>

<style lang="scss" scoped>
/* // 测试scss配置 */
$title-color: red;

#hearder {
  position: relative;
  /* // color: $title-color; */
}

#hearder li:first-of-type {
  // margin-left: 16px;
  padding-left: 30px;
}

.btn_user {
  height: 100%;
  display: inline-block;
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translate(0, -50%);
}

.btn_user:focus {
  outline: none;
}

.btn_user_icon {
  position: relative;
  top: 50%;
  transform: translate(6px, -50%);
}

.btn_msg {
  right: 100px;
}

.btn_home {
  // width: 40px;
  left: 10px;
  display: inline-block;
  position: absolute;
}

.btn_home:hover {
  cursor: pointer;
}

.btn_editQus {
  right: 120px;
}
</style>
