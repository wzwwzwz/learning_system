<template>
  <div class="ls_home">
    <el-container class="ls_home_container">
      <el-header class="ls_home_header ls_home_header">
        <div class="ls_home_content_wrap">
          <z-header @editExam="editExam" @uploadAvatarFun="uploadAvatarFun()"></z-header>
        </div>
      </el-header>
      <div class="g_spilt_div_Horizontal"></div>
      <el-main class="ls_home_main">
        <div class="ls_home_content_wrap">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>

    <!-------- 弹出框集合 -------->
    <!-- 出题表单弹框 -->
    <examQueDialog ref="examQueForm" @submitForm="submitForm($event)" :dialogTiltle="examQueData.title"></examQueDialog>
    <upload-Avatar ref="dialogUploadAvatar"></upload-Avatar>
  </div>
</template>
<script>
import zHeader from '@/components/common/header.vue'
import hallo from '@/components/HelloWorld.vue'
// import zAside from "@/pages/common/aside.vue";
import examQueDialog from '@/components/common/examQueDialog.vue'
import uploadAvatar from '@/components/common/uploadAvatar.vue'

export default {
  name: 'index',
  data () {
    return {
      examQueData: {
        showDialog: false,
        title: ''
      }
    }
  },
  components: {
    // zAside,
    zHeader,
    hallo,
    examQueDialog,
    uploadAvatar
  },
  created () {
    // this.$store.commit("changeBreadcumb", []);
    // this.$router.push({
    //   name: 'learn_dir'
    // })
  },
  methods: {
    editExam () {
      // this.examQueData.title = ''
      this.$refs.examQueForm.openDialog(true)
    },
    uploadAvatarFun () {
      this.$refs.dialogUploadAvatar.openDialog()
    }
  }
}
</script>
<style lang="scss" scoped>
.ls_home,
.ls_home_container {
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
  background-color: #e9eef3;
  color: #333;
  // text-align: center;
  // line-height: 160px;
  padding: 0;
}

body > .el-container {
  margin-bottom: 40px;
}
</style>
