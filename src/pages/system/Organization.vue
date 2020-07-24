<template>
  <div class="wrap">
    <!-- 权限列表 -->
    <div class="custom-tree-container">
      <div class="block">
        <el-tree :data="treedData" :show-checkbox="showCheckbox" node-key="id" default-expand-all :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button type="text" size="small" @click="() => append(data)">增加</el-button>
              <el-button type="text" size="small" @click="() => modify(data)">修改</el-button>
              <el-button type="text" size="small" @click="() => remove(node, data)">删除</el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>

    <!-- dialog弹框开始 -->
    <el-dialog :title="dialogTiltle" :visible.sync="dialogVisible" width="30%" @close="cancel('permissionForm')"
      :close-on-click-modal="false">
      <el-form label-width="80px" :model="permissionForm" :rules="rules" ref="permissionForm">
        <el-form-item :label="nameLabel" prop="name">
          <el-input type="text" autocomplete="on" v-model="permissionForm.name" clearable maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="text" autocomplete="on" v-model="permissionForm.descript" clearable maxlength="100"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submitForm(permissionForm)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- dialog弹框结束 -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  created () {
    // 从页面跳转的化需要获取
    let id = this.$route.query.id
    this.id = id
    this.getRootKey()
    // this.getCompany(id) // 获取部门等级
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getBasicsReqURL'])
  },
  data () {
    // 添加了一个最高级：所有权限
    const datatestTest = [
      {
        id: 0,
        label: '组织根目录',
        children: [],
        type: 0
      }
    ] // 权限列表
    return {
      // 树形结构数据
      treedData: JSON.parse(JSON.stringify(datatestTest)),
      // 是否有勾选框
      showCheckbox: false,
      // 部门id
      id: '',
      dialogVisible: false,
      dialogTiltle: '表单名称',
      nameLabel: '部门名称',
      permissionForm: {
        name: '',
        descript: ''
      },
      // 表单校验规则
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          {
            pattern: /[^ ]/,
            message: '不能为空格',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 获取跟节点key
    getRootKey () {
      let objData = new this.$dataProcess.Parameter('get_root_key')
      objData.setFunc('get_root_key')

      let obj = {
        id: 123,
        key: '',
        question: 14,
        option: '12536',
        answer: 's',
        level: 0,
        authid: this.getUserInfo.userId
      }

      objData.setParams(obj)

      for (let idx = 0; idx < 100; idx++) {
        objData.setParams(obj)
      }

      // console.log(objData.getJson())
      // console.log(objData.getEncryptData())
      let data = objData.getJson()
      // let data = objData.getEncryptData()

      let url = `/company/getRootKey`
      this.$request(url, { data: data }).then((res) => {
        // console.log('ok', res)
      }).catch(() => {
        // console.log('error', error)
      })

      this.$request('/post1', { data: data }).then((res) => {
        // console.log('ok', res)
      }).catch(() => {
        // console.log('error', error)
      })
    },
    // 获取部门等级
    getCompany (id) {
      this.axios.post(`${this.getBasicsReqURL}/company/getCompany`, {
        id
      }).then(data => {
        if (data.data.companyMenuDtos.length !== 0) {
          this.treedData = data.data.companyMenuDtos
        } else {
          this.$router.push({ path: '/systemManagement/Company' })
        }
      })
    },
    // 增加子节点
    append (data) {
      // let level = data.path.split('/').length - 2
      let level = 1
      if (level >= 8) {
        this.$message.error('抱歉！部门级别最高八级')
      } else {
        this.nameLabel = '部门名称'
        this.permissionForm = {
          parentId: data.id,
          path: data.path
        }
        this.dialogVisible = true
        this.dialogTiltle = '增加'
      }
    },
    // 修改节点
    modify (data) {
      // 最高级别
      data.parentId === 0
        ? (this.nameLabel = '企业名称')
        : (this.nameLabel = '部门名称')

      this.dialogVisible = true
      this.dialogTiltle = '修改'
      this.permissionForm = {
        name: data.label,
        parentId: data.parentId,
        id: data.id
      }
    },
    // 删除节点
    remove (node, data) {
      this.$confirm('您确定要删除此权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        // 点击确定
        .then(() => {
          // 删除接口
          this.axios.post(`${this.getBasicsReqURL}/company/deleteCompany`, {
            id: data.id
          }).then(data => {
            if (data.code === 200) {
              this.$message.info(data.msg)
              if (data.msg === '删除成功') {
                this.getCompany(this.id)
              }
            }
          })
        })
        // 点击取消
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    // 取消表单提交
    cancel () {
      const vm = this
      vm.dialogVisible = false
      vm.$refs.permissionForm.resetFields()
      vm.$refs.permissionForm.clearValidate()
    },
    // 提交表单
    submitForm (data) {
      this.$refs.permissionForm.validate(valid => {
        if (valid) {
          if (this.dialogTiltle === '增加') {
            let url = `${this.getBasicsReqURL}/company/insertCompany`
            this.addModifyInterface(url, data)
          } else {
            let url = `${this.getBasicsReqURL}/company/updateCompany`
            this.addModifyInterface(url, data)
          }
          this.dialogVisible = false
        } else {
          this.$message.error('请填写完表单')
        }
      })
    },
    // 添加(修改)接口
    addModifyInterface (url, paramData) {
      this.axios.post(url, paramData).then(data => {
        if (data.code === 200) {
          if (data.msg === '添加成功' || data.msg === '修改成功') {
            this.getCompany(this.id)
          }
        }
      })
    }
  }
}
</script>
<style scoped>
/* .wrap {

} */

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.custom-tree-node span:nth-child(2) {
  display: inline-block;
}
.el-select {
  width: 100%;
}
</style>
