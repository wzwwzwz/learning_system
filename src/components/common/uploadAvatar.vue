<template>
  <div id="uploadAvatar">
    <el-dialog center title="上传头像" :visible.sync="dialogTableVisible" width="600px">
      <cpt-Cropper @closeDialog="closeDialog()"></cpt-Cropper>
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
  methods: {
    openDialog () {
      this.dialogTableVisible = true
    },
    closeDialog () {
      this.dialogTableVisible = false
    }
  }
}
</script>
