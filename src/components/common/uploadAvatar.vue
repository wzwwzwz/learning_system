<template>
  <div id="uploadAvatar">
    <el-dialog center title="上传头像" :visible.sync="dialogTableVisible" width="600px">
      <cpt-Cropper @closeDialog="closeDialog()" @upload="upload($event)"></cpt-Cropper>
    </el-dialog>
  </div>
</template>

<script>
import cptCropper from '@/components/common/cropper'
export default {
  name: '',
  components: {
    cptCropper
  },
  data () {
    return {
      dialogTableVisible: false
    }
  },
  created () {
    this.openDialog()
  },
  methods: {
    openDialog () {
      this.dialogTableVisible = true
    },
    closeDialog () {
      this.dialogTableVisible = false
    },
    upload (param) {
      console.log('上传参数', param)
      console.log('转化为字符串', JSON.stringify(param))

      let objData = new this.$dataProcess.Parameter()
      objData.setParams({ data: param })

      this.$request('/uploadAvatar', { data: objData.getJson() }).then((res) => {
        console.log('ok', res)
      }).catch((error) => {
        console.log('error', error)
      })
    }
  }
}
</script>
