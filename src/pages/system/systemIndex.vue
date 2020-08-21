<template>
  <div id="systemIdex" class="component_wrap">
    <el-row class="menu">
      <el-col :style="{width:spanWidth}">
        <el-menu :default-active="defaultActive" :active="curMenu" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
          @select="selectMenu">

          <el-menu-item v-for="(item,idx) in arrMenu" :key="idx" :index="item.path">
            <i :class="item.icon"></i>
            <span slot="title">{{item.val}}</span>
          </el-menu-item>

        </el-menu>
      </el-col>

      <el-col class="childrenMenu" :style="{width:`calc(100% - ${spanWidth})`}">
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </el-col>
    </el-row>

  </div>
</template>
<script>
export default {
  created () {
    this.defaultActive = this.$route.path
  },
  data () {
    return {
      menuSpan: 3,
      spanWidth: '130px',
      defaultActive: '/organization',
      curMenu: '1',
      arrMenu: [
        // {
        //   icon: 'el-icon-menu',
        //   path: '/company',
        //   val: '公司'
        // },
        {
          icon: 'el-icon-menu',
          path: '/organization',
          val: '组织架构'
        },
        {
          icon: 'el-icon-menu',
          path: '/user',
          val: '用户'
        },
        {
          icon: 'el-icon-menu',
          path: '/privilege',
          val: '权限'
        },
        {
          icon: 'el-icon-menu',
          path: '/role',
          val: '权限组'
        }

      ]
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    },
    selectMenu (index, indexPath) {
      // console.log(index, indexPath)

      this.$router.push(index)
    }
  }
}

</script>
<style lang="scss" scoped>
#systemIdex {
  padding-left: 0;
  padding-right: 0;

  .menu {
    height: 100%;

    div {
      height: inherit;
      ul {
        height: inherit;
      }
    }
  }

  .childrenMenu {
    padding: 20px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
  // transition: width 1s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
