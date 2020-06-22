<template>
  <div class="home">
    <!-- <el-container class="home_el-container">
      <el-header>
        <z-header></z-header>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container> -->

    <el-container class="home_el-container">
      <el-header class="home_el_header">
        <z-header></z-header>
      </el-header>
      <div class="g_spilt_div_Horizontal"></div>
      <el-main class="ls_main_content">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import zHeader from '@/components/common/header.vue'
import hallo from '@/components/HelloWorld.vue'
// import zAside from "@/pages/common/aside.vue";
export default {
  name: 'index',
  data () {
    return {}
  },
  components: {
    // zAside,
    zHeader,
    hallo
  },
  created () {
    // this.$store.commit("changeBreadcumb", []);
    // this.$router.push({
    //   name: 'learn_dir'
    // })
  }
}
</script>
<style lang="scss" scoped>
.home,
.home_el-container {
  width: 100%;
  height: 100%;
}

.el-header {
  color: #333;
  text-align: center;
  padding: 0;
  background: #fff;
}

.el-main {
  /* background-color: #e9eef3; */
  color: #333;
  // text-align: center;
  // line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}
</style>
