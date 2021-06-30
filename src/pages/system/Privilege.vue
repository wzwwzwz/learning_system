<template>
  <div class="wrap">
    <!-- 权限列表 -->
    <div class="custom-tree-container">
      <div class="block">
        <el-tree :data="treedData" :show-checkbox="showCheckbox" node-key="id" :default-expanded-keys="[-1]" :accordion="true"
          :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span style="display: inline-block;">
              <template>
                <el-button type="text" size="small" v-if="data.type === '0'" style="color:green">菜单</el-button>
                <el-button type="text" size="small" v-if="data.type === '1'" style="color:#66b1ff">功能</el-button>
              </template>
              <el-button type="text" size="small" @click="() => append(data)" :disabled="data.type === '1'">增加</el-button>
              <el-button type="text" size="small" @click="() => modify(data)" :disabled="data.id === '-1'">修改</el-button>
              <el-button type="text" size="small" @click="() => remove(node, data)">删除</el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>

    <!-- 角色操作dialog弹框开始 -->
    <el-dialog :title="dialogTiltle" :visible.sync="dialogVisible" width="30%" @close="cancel('permissionForm')"
      :close-on-click-modal="false">
      <el-form label-width="80px" :model="permissionForm" ref="permissionForm" :rules="rules">
        <el-form-item label="权限名称" prop="authName">
          <el-input type="text" autocomplete="on" v-model="permissionForm.authName" clearable maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="权限路径" prop="url">
          <el-input type="text" autocomplete="on" v-model="permissionForm.url" :disabled="inputOff" clearable maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="父级权限" :rules="[{ required: true, message: '请选择父级权限'}]">
          <el-select v-model="value" :disabled="selecterOff" placeholder="请选择父级权限" @change="selectTrigger(value)" clearable>
            <el-option v-for="item in optionsSelecter" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" :rules="[{ required: true, message: '请选择类型'}]">
          <el-select v-model="typeValue" clearable placeholder="请选择类型" :disabled="showType">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submitForm(permissionForm)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 角色操作dialog弹框结束 -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

var list
export default {
  name: '',
  computed: {
    ...mapGetters(['getBasicsReqURL'])
  },
  created () {
    // this.$store.commit('changeBreadcumb', this.breadcrumb)
    this.getAuthInfo() // 获取所有权限列表
  },
  data () {
    // 添加了一个最高级：所有权限
    const datatestTest = [
      {
        id: -1,
        label: '所有权限',
        children: [],
        type: 0
      }
    ]
    // 权限列表
    return {
      treedData: JSON.parse(JSON.stringify(datatestTest)),
      breadcrumb: [
        { name: '系统管理', path: '' },
        { name: '权限管理', path: '' }
      ],
      dialogVisible: false,
      dialogTiltle: '表单名称',
      permissionForm: {
        url: '',
        authName: '',
        parentId: '',
        id: '',
        type: ''
      },
      // 表单校验规则
      rules: {
        authName: [
          { required: true, message: '请输入权限名称', trigger: 'blur' },
          {
            pattern: /[^ ]/,
            message: '不能为空',
            trigger: 'blur'
          }
        ],
        url: [
          { required: true, message: '请输入路径名称', trigger: 'blur' }
          // {
          //   // pattern: window._check.isEnglistRegSlash,
          //   message: '只能输入英文数字、斜杠',
          //   trigger: 'blur'
          // }
        ]
      },
      permissionOptions: [],
      // 权限下拉选择
      optionsSelecter: [
        {
          value: -1,
          label: '所有权限'
        }
      ],
      value: '', // 默认选择
      selecterOff: false, // 下拉选择是否禁用
      showCheckbox: false, // 是否有勾选框
      allPermissionList: [], // 存储所有权限
      inputOff: false,
      showType: false,
      typeValue: '',
      typeOptions: [
        {
          value: '0',
          label: '菜单'
        },
        {
          value: '1',
          label: '功能'
        }
      ]

    }
  },
  methods: {
    // 获取所有权限列表
    getAuthInfo () {
      const vm = this
      vm.$request(`/get`).then(
        data => {
          if (data.code === 200) {
            list = data.data // 后台返回的所有权限列表
            vm.optionsSelecter = data.data
            vm.allPermissionList = data.data // 将所有权限数据存储
            vm.getAllSelecterOptions()
            let treeAllData = vm.treedData // 所有权限(最大级菜单)
            this.loopMenu(treeAllData) // 循环菜单等级
          }
        }
      )
    },
    // 循环菜单等级
    loopMenu (data) {
      for (let [index, item] of Object.entries(data)) {
        this.traversingList(list, data, index)
        let subMenu = item.children
        this.loopMenu(subMenu)
      }
    },
    // 遍历列表
    traversingList (list, data, j) {
      for (var i = 0; i < list.length; i++) {
        if (data[j].id === list[i].parentId) {
          data[j].children.push(this.InitDataSubset(list[i]))
        }
      }
    },
    // 初始化权限列表数据的子节点
    InitDataSubset (data) {
      var newChild = {
        id: data.id,
        label: data.authName,
        parentId: data.parentId,
        children: [],
        url: data.url,
        type: data.type
      }
      return newChild
    },
    // 增加子节点
    append (data) {
      const vm = this
      vm.dialogVisible = true
      vm.selecterOff = true
      vm.inputOff = false
      vm.showType = false
      vm.dialogTiltle = '增加'
      vm.value = data.label // 设置父级权限默认值
      vm.typeValue = ''
      let parentId, url, authName, id, type
      parentId = data.id
      this.permissionForm = { parentId, url, authName, id, type }
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
          this.$post(
            `${this.getBasicsReqURL}/system/auth/deleteAuth`,
            data.id
          ).then(data => {
            if (data.code === 200) {
              this.$confirm('操作成功, 是否重新登陆?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
                .then(() => {
                  this.$router.replace('/login')
                })
                .catch(() => {
                  this.$router.go(0)
                })
            }
          })
        })
        // 点击取消
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    // 修改节点
    modify (data) {
      const vm = this
      data.type === 0 ? (this.typeValue = '菜单') : (this.typeValue = '功能')
      vm.dialogVisible = true
      vm.selecterOff = false
      vm.showType = true
      vm.dialogTiltle = '修改'

      let { parentId, url, label, id, type } = data
      let authName = label
      vm.permissionForm = { parentId, url, authName, id, type }

      // 打开弹窗默认显示下拉列表的值
      for (let item of vm.allPermissionList) {
        if (data.parentId === item.id) {
          vm.value = item.authName
          break
        } else {
          vm.value = '所有权限'
        }
      }
    },
    // 取消表单提交
    cancel () {
      const vm = this
      vm.dialogVisible = false
      vm.$refs.permissionForm.resetFields() // 清空表单
      vm.$refs.permissionForm.clearValidate()
    },
    // 提交表单
    submitForm (data) {
      const vm = this
      let paramData
      vm.$refs.permissionForm.validate(valid => {
        if (valid && this.typeValue !== '' && this.value) {
          if (vm.dialogTiltle === '增加') {
            paramData = {
              authName: data.authName,
              parentId: data.parentId,
              url: data.url,
              type: this.typeValue
            }

            let url = `/system/auth/saveAuth`
            vm.addModifyInterface(url, paramData)
          } else {
            paramData = {
              authName: data.authName,
              parentId: data.parentId,
              url: data.url,
              id: data.id,
              type: data.type
            }

            let url = `/system/auth/updateAuth`
            vm.addModifyInterface(url, paramData)
          }
          vm.dialogVisible = false
        } else {
          vm.$message.error('请填写完表单')
        }
      })
    },
    // 添加(修改)接口
    addModifyInterface (url, paramData) {
      const vm = this
      vm.$request(url, paramData).then(data => {
        if (data.code === 200) {
          this.$confirm('操作成功, 是否重新登陆?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.$router.replace('/login')
            })
            .catch(() => {
              this.$router.go(0)
            })
        }
      })
    },

    // 获取所有权限下拉列表(表单的所有权限下拉选择器)
    getAllSelecterOptions () {
      const vm = this
      let permission = []
      for (let item of this.optionsSelecter) {
        if (item.type === '0') {
          permission.push(item)
        }
      }
      let options = [
        {
          id: -1,
          label: '所有权限',
          value: '所有权限'
        }
      ]

      for (let [index, item] of Object.entries(permission)) {
        options.push({
          id: item.id,
          parent: item.parentId,
          value: index + 1,
          label: item.authName,
          type: item.type
        })
      }
      vm.optionsSelecter = options
    },

    // 下拉列表选择
    selectTrigger (val) {
      // 选中的当前下拉列表的value
      for (let i = 0; i < this.optionsSelecter.length; i++) {
        if (val === this.optionsSelecter[i].value) {
          this.permissionForm.parentId = this.optionsSelecter[i].id
        }
      }
    }
  }
}
</script>
<style scoped>
.wrap {
  /* margin-top: 20px; */
}
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
