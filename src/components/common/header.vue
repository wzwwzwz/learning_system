<template>
  <div id="hearder" class="">
    <!-- 菜单 -->
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" :router="b_router">
      <!-- 主页 -->
      <el-menu-item index="/">主页</el-menu-item>
      <div class="icon_wrap btn_home" @click="gotohome">
        <i class="el-icon-s-home"></i>
      </div>

      <template v-for="item in arr_menu">
        <el-menu-item :index="item.path" v-html="item.val" :key="item.path"></el-menu-item>
      </template>

      <div class="nav_right">
        <!-- 出题 -->
        <div class="nav_item">
          <el-button type="text" icon="el-icon-edit" style="height: 100%;" @click="editExam()">出题</el-button>
        </div>

        <!-- 消息 -->
        <div class="nav_item">
          <el-badge :hidden="o_msg.b_new_msg" :value="o_msg.msg_num" style="vertical-align: initial;">
            <i class="el-icon-message-solid"></i>
          </el-badge>
        </div>

        <!-- 头像下拉菜单 -->
        <div class="nav_item">
          <el-dropdown trigger="click" class="btn_user" @command="handleCommand">
            <span class="el-dropdown-link btn_user_icon" style="display: inline-flex">
              <el-avatar icon="el-icon-user-solid"></el-avatar>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-s-check" command="my_audit">我的审核</el-dropdown-item>
              <el-dropdown-item icon="el-icon-chat-dot-square" command="my_msg">我的评论</el-dropdown-item>
              <el-dropdown-item icon="el-icon-notebook-1" command="my_exam_que">我的题目</el-dropdown-item>
              <el-dropdown-item icon="el-icon-document" command="my_exam">我的考试</el-dropdown-item>
              <el-dropdown-item icon="el-icon-document" command="my_upload_avatar">上传头像</el-dropdown-item>
              <div class="g_spilt_div_Horizontal"></div>
              <el-dropdown-item icon="el-icon-circle-close" command="sign_out">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

      </div>
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
  name: '',
  components: {

  },
  data () {
    return {
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

      switch (command) {
        case 'my_upload_avatar':
          vm.$emit('uploadAvatarFun')
          break
        case 'sign_out':
          vm.loginOut()
          break
        default:
          break
      }

      // if (command === 'pwd') {
      //   // vm.$router.push("/personalSet/passwordReset");
      // }
      // if (command === 'msg') {
      //   // vm.$router.push("/personalSet/personManagement");
      // }
    },
    loginOut () {
      const vm = this
      vm.$confirm('确认退出吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          sessionStorage.clear()
          vm.$router.push('/login')
        })
        .catch(() => { })
    },
    editExam () {
      this.$emit('editExam')
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

.nav_right {
  display: inline-flex;
  position: absolute;
  right: 0px;

  .nav_item {
    color: #000;
    height: 100%;
    display: inline-block;
    height: 60px;
    line-height: 60px;
    margin: 0 10px;

    &:hover {
      cursor: pointer;
    }
  }
}

.btn_user {
  height: 100%;

  &:focus {
    outline: none;
  }
}

.btn_home {
  // width: 40px;
  left: 10px;
  display: inline-block;
  position: absolute;

  &:hover {
    cursor: pointer;
  }
}
</style>
