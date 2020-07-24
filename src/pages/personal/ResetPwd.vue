<template>
  <div id="reset_pwd" class="component_wrap">
    <el-form :model="pwdForm" status-icon :rules="rules2" ref="pwdForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="原始密码" prop="pwd">
        <el-input type="password" v-model="pwdForm.pwd" autocomplete="off" maxlength="16"></el-input>
      </el-form-item>
      <el-form-item label="新的密码" prop="newPwd">
        <el-input type="password" v-model="pwdForm.newPwd" autocomplete="off" maxlength="16"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(pwdForm)">提交</el-button>
        <el-button @click="resetForm(pwdForm)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import crypto from 'crypto'

export default {
  created () {
    let id = sessionStorage.getItem('id')
    this.pwdForm.userId = id
  },
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.pwdForm.checkPass !== '') {
          this.$refs.pwdForm.validateField('newPwd')
        }
        callback()
      }
    }
    return {
      pwdForm: {
        userId: '',
        pwd: '',
        newPwd: ''
      },
      rules2: {
        pwd: [
          { required: true, message: '请输入原始密码', trigger: ['blur'] },
          //   { validator: validatePass, trigger: 'blur' },
          {
            // pattern: window._check.pattern,
            message: '请输入正确的密码格式（4-16位任意字符)',
            trigger: ['blur', 'change']
          }
        ],
        newPwd: [
          {
            required: true,
            message: '请输入新的密码',
            trigger: ['blur', 'change']
          },
          {
            // pattern: window._check.pattern,
            message: '请输入正确的密码格式（4-16位任意字符)',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    submitForm (form) {
      const vm = this
      vm.$refs.pwdForm.validate(valid => {
        if (valid) {
          if (vm.pwdForm.pwd === vm.pwdForm.newPwd) {
            // 两个密码相同
            this.$alert('新的密码不能与旧密码相同，请重新设置', '提示！', {
              confirmButtonText: '确定',
              callback: () => {
                vm.pwdForm.newPwd = ''
              }
            })
          } else {
            // 两个密码不相同
            let data = {
              newPwd: vm.cryptPwd(form.newPwd),
              psw: vm.cryptPwd(form.pwd),
              key: form.userId
            }

            let objData = new vm.$dataProcess.Parameter('set_user_psw')
            objData.setParams(data)

            vm.$request('/system/user/pwd/updatePassword', { data: objData.getJson() }).then((res) => {
              console.log('ok', res)
              if (data.code === 200) {
                this.$message({
                  message: '修改密码成功！请重新登陆',
                  type: 'success'
                })

                this.$router.replace('/login')
              }
            }).catch((error) => {
              console.log('error', error)
            })
          }
        } else {
          this.$message({
            message: '表单填写有误！',
            type: 'error'
          })
          return false
        }
      })
    },
    resetForm () {
      this.$refs.pwdForm.resetFields()
    },
    // 加密的方法
    cryptPwd (value) {
      var md5 = crypto.createHash('md5')
      return md5.update(value).digest('hex')
    }
  }
}
</script>
<style scoped >
.el-form {
  width: 400px;
  margin-top: 50px;
}
</style>
