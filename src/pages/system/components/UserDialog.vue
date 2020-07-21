<template>
  <div class='user_dialog'>
    <el-dialog :title="dialogTiltle" :visible.sync="dialogVisible" :close-on-click-modal="false" width="50%">
      <el-form label-width="80px" :model="userForm" :rules="rules" ref="userForm">

        <el-row>
          <el-col :span="6">
            <el-form-item label="用户姓" prop="surname">
              <el-input type="text" v-model="userForm.surname" clearable maxlength="3" :disabled="dialogTiltle ==='修改用户' "></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="用户名" prop="persionname">
              <el-input type="text" v-model="userForm.persionname" clearable maxlength="5" :disabled="dialogTiltle ==='修改用户' "></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="全名:">
              {{ userForm.surname && userForm.persionname ? `${userForm.surname}${userForm.persionname}` : userForm.surname || userForm.persionname }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="用户名称" prop="roleName">
          <el-input type="text" v-model="userForm.roleName" clearable maxlength="15" :disabled="dialogTiltle ==='修改用户' ">
          </el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="userForm.gender" placeholder="请选择性别" style="display:block">
            <el-option v-for="item in getArrGender" :key="item.name" :label="item.label" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input type="text" v-model.number="userForm.age" clearable maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="onboarding">
          <el-date-picker v-model="userForm.onboarding" align="left" type="date" placeholder="选择日期" :picker-options="pickerOptions"
            :editable=false @change="changeDate">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所属部门" prop="department">
          <el-input type="text" v-model="userForm.department" clearable maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input type="text" v-model="userForm.phone" clearable maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="userForm.email" clearable maxlength="30" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="descript">
          <el-input type="text" maxlength="15" v-model="userForm.descript" clearable></el-input>
        </el-form-item>

        <!--权限选择 -->
        <el-form-item label="权限选择" prop="auth">
          <el-radio-group v-model="userForm.auth" @change="authChg">
            <template v-for="item in getArrUserType">
              <el-radio :key="item.idx" :label="item.idx" border size="small">{{
                item.val
              }}</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogCancel()">取 消</el-button>
        <el-button type="primary" @click="roleDialogOk()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import formValidte from '@/utils/form-validte'
import { mapGetters } from 'vuex'

export default {
  name: '',
  components: {},
  computed: {
    ...mapGetters(['getArrUserType', 'getArrGender'])
  },
  data () {
    return {
      dialogTiltle: '',
      dialogVisible: false,
      userForm: {},
      // 用户表单添加
      roleFormAdd: {
        roleName: '',
        description: '',
        auth: 3,
        surname: '',
        persionname: '',
        gender: '',
        age: '',
        onboarding: '',
        department: '',
        phone: '',
        email: '',
        descript: ''
      },
      // 单选按钮组
      defalutAuth: 3,
      // 时间选择器
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      // 校验规则
      rules: {
        surname: [
          { required: true, message: '请输入用户姓氏', trigger: ['change', 'blur'] },
          { validator: formValidte.isEmpty, trigger: ['change', 'blur'] }
        ],
        persionname: [
          { required: true, message: '请输入用户名称', trigger: ['change', 'blur'] },
          { validator: formValidte.isEmpty, trigger: ['change', 'blur'] }
        ],
        roleName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { validator: formValidte.userName, trigger: ['change', 'blur'] }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: ['change', 'blur'] }
        ],
        age: [
          { required: true, message: '年龄不能为空' },
          { type: 'number', message: '年龄必须为数字值' }
        ],
        onboarding: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请填写电话', trigger: 'blur' },
          { validator: formValidte.phone, trigger: ['change', 'blur'] }
        ],
        email: [
          { required: true, message: '请填写邮箱', trigger: 'blur' },
          { validator: formValidte.email, trigger: ['change', 'blur'] }
        ],
        auth: [
          { required: true, message: '请选择权限', trigger: 'change' }
        ]

      }
    }
  },
  created () {

  },
  mounted () { },
  methods: {
    changeDate (val) {
      console.log(val)
    },
    /**
     * @description 用户操作
     * @param { Number } statu 操作状态码 0 === 添加 || 1 === 修改
     * @param { Number } data 表单数据
    **/
    userAction (statu, data) {
      let formData = JSON.parse(JSON.stringify(data))
      let vm = this
      vm.dialogVisible = true
      //   this.$nextTick(() => {
      if (vm.$refs.userForm) {
        // 清除表单校验
        vm.$refs.userForm.resetFields()
      }

      if (statu === 0) {
        vm.dialogTiltle = '添加用户'
        vm.userForm = JSON.parse(JSON.stringify(vm.roleFormAdd))
        //   vm.defaultData()
      } else {
        vm.dialogTiltle = '修改用户'
        vm.userForm = formData
        // vm.defaultData(data.list)
      }
      //   })
    },
    // 用户弹窗点击取消按钮
    roleDialogCancel () {
      const vm = this
      vm.dialogVisible = false
      vm.roleFormAdd.roleName = ''
      vm.roleFormAdd.description = ''
      // vm.getRoleInfo() // 刷新表格
    },
    // 用户弹窗点击确定按钮
    roleDialogOk () {
      console.log(this.userForm)

      const vm = this
      vm.$refs.userForm.validate(valid => {
        if (valid) {
          var data = {
            roleName: vm.userForm.roleName,
            description: vm.userForm.description,
            auth: vm.userForm.auth
          }

          // console.log(data)

          if (vm.userForm.id) {
            // 修改用户
            data.id = vm.userForm.id
            //   let url = `${vm.$store.state.basicsReqURL}/system/role/updateRole`
            // let url = ''
            // vm.sendRequest(url, data)
          } else {
            // 添加用户
            //   let url = `${vm.$store.state.basicsReqURL}/system/role/saveRole`
            // let url = ''
            // vm.sendRequest(url, data)
            vm.roleFormAdd.roleName = ''
            vm.roleFormAdd.description = ''
            // vm.roleFormAdd.auth = ''
          }
          //   vm.dialogVisible = false
        } else {
          vm.$message.error('请填写完表单')
        }
      })
    },
    authChg (value) {
      console.log(value, this.defalutAuth)
    }

  },
  filters: {
    formfullName (val) {
      console.log(val)
    }
  }
}
</script>

<style lang='scss'>
.user_dialog .el-dialog__body {
  padding-bottom: 0;

  .el-form-item {
    // margin-bottom: 20px;
  }
}
</style>

<style lang='scss' scoped>
</style>
