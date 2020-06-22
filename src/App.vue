<template>
  <div id="app">
    <router-view />

    <!-- <el-container class="app_el_container">
      <el-header class="app_el_header">
        <z-header></z-header>
      </el-header>
      <div class="g_spilt_div_Horizontal"></div>
      <el-main class="ls_main_content">
        <router-view></router-view>
      </el-main>
    </el-container> -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body {
  margin: 0;
  height: 100%;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

html {
  height: 100%;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
  height: 100%;
}

.app_el_container {
  width: 100%;
  height: 100%;
  /* padding: 0; */
}

.app_el_header {
  padding: 0;
  background: #fff;
}
</style>
