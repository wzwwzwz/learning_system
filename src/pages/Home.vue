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
    <examQueDialog ref="examQueForm" @submitForm="examQueDialogSubmitForm($event)" :dialogTiltle="examQueData.title"></examQueDialog>
    <Upload-Avatar ref="dialogUploadAvatar"></Upload-Avatar>

  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'

import zHeader from '@/components/common/header.vue'
import examQueDialog from '@/components/common/examQueDialog.vue'

const UploadAvatar = () => import('@/components/common/UploadAvatar.vue')

export default {
  name: 'index',
  data () {
    return {
      examQueData: {
        showDialog: false,
        title: ''
      },
      timer: null
    }
  },
  components: {
    zHeader,
    examQueDialog,
    UploadAvatar
  },
  created () {
    this.clearTimer()
    this.isOnline()
    let vm = this
    vm.timer = setInterval(() => {
      vm.isOnline()
    }, 1000 * 60 * 5)
  },
  computed: {
    ...mapGetters(['getAesKey'])
  },
  methods: {
    ...mapMutations(['setAesKey']),
    editExam () {
      // this.examQueData.title = ''
      this.$refs.examQueForm.openDialog(true)
    },
    uploadAvatarFun () {
      this.$refs.dialogUploadAvatar.openDialog()
    },
    // 提交出题
    examQueDialogSubmitForm (data) {
      console.log(data)

      let obj = this.$store.state.classTestBank
      obj.add(data)
      console.log(obj.getData())
    },
    isOnline () {
      let objData = new this.$dataProcess.Parameter()
      objData.setFunc('heartbeat')
      objData.setParams({ key: this.getAesKey })

      let vm = this
      this.$request('/heartbeat', { data: objData.getJson() }).then((res) => {
        console.log('ok', res)
        objData.clear()
        objData.setJson(res)
        let data = objData.getParams()

        // update aes key
        vm.setAesKey(data[0].key)
      }).catch((error) => {
        console.log('error', error)
      })
    },
    clearTimer () {
      if (this.timer) {
        clearInterval(this.timer)
      }
    }
  },
  destroyed () {
    this.clearTimer()
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
  // color: #333;
  text-align: center;
  padding: 0;
  background: #fff;
}

.el-main {
  background-color: #e9eef3;
  // color: #333;
  // text-align: center;
  // line-height: 160px;
  padding: 0;
}

body > .el-container {
  margin-bottom: 40px;
}
</style>
