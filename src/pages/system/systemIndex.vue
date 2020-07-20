<template>
  <div id="systemIdex" class="component_wrap">
    <el-row class="menu">
      <el-col :span="menuSpan">
        <el-menu default-active="1" :active="curMenu" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
          @select="selectMenu">
          <el-menu-item index="/department">
            <i class="el-icon-menu"></i>
            <span slot="title">部门</span>
          </el-menu-item>
          <!-- <router-link to="/organization"> -->
          <el-menu-item index="/user">
            <i class="el-icon-menu"></i>
            <span slot="title">用户</span>
          </el-menu-item>
          <!-- </router-link> -->
          <el-menu-item index="/system">
            <i class="el-icon-document"></i>
            <span slot="title">权限</span>
          </el-menu-item>
          <el-menu-item index="/privilege">
            <i class="el-icon-setting"></i>
            <span slot="title">权限组</span>
          </el-menu-item>
          <el-menu-item index="/organization">
            <i class="el-icon-setting"></i>
            <span slot="title">organization</span>
          </el-menu-item>
        </el-menu>
      </el-col>

      <el-col :span="24-menuSpan" class="childrenMenu">
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
  },
  data () {
    return {
      menuSpan: 3,
      curMenu: '1'
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    selectMenu (index, indexPath) {
      console.log(index, indexPath)

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
