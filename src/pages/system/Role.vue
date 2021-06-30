<template>
  <div>
    <div class="user">
      <el-button type="primary" class="adduser" size="small" @click="rolrData(0,roleForm)">添加角色</el-button>
    </div>

    <!-- 所有角色表格开始 -->
    <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width:100%">
      <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
      <el-table-column prop="description" label="角色描述" width="800" align="center" :formatter="isNull"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="rolrData(1,scope.row)" type="primary" plain size="small">修改角色</el-button>
          <el-button type="danger" plain size="small" @click="deleteRole(scope.row.id)">删除角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 所有角色表格开始结束 -->

    <!-- 角色操作dialog弹框开始 -->
    <el-dialog :title="dialogTiltle" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
      <el-form label-width="80px" :model="roleForm" :rules="rules" ref="roleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input type="text" v-model="roleForm.roleName" clearable maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input type="text" maxlength="15" v-model="roleForm.description" clearable></el-input>
        </el-form-item>
        <!--权限选择 -->
        <el-form-item label="权限选择" :rules="[{ required: true, message: '请选择父级权限'}]">
          <el-tree :data="treeData" show-checkbox node-key="id" :props="defaultProps" :default-checked-keys="selected"
            :default-expanded-keys="selected" ref="tree" :default-expand-all="showAllNodes" :check-strictly="false" :accordion="true">
          </el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleCancel()">取 消</el-button>
        <el-button type="primary" @click="roleOk()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 角色操作dialog弹框结束 -->

    <!-- 分页显示 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[5, 10, 20, 30, 40]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length"
      background>
    </el-pagination>
  </div>
</template>
<script>
export default {
  created () {
    // this.$store.commit('changeBreadcumb', this.breadcrumb)
    this.getRoleInfo()
    this.getAllMenu()
  },
  data () {
    return {
      // 添加角色
      input: '',
      dialogVisible: false,
      pageIndex: 0,
      tableData: [],
      // 面包屑
      breadcrumb: [
        { name: '系统管理', path: '' },
        { name: '角色管理', path: '' }
      ],
      // 添加角色表单
      addroleForm: {
        roleName: '',
        description: ''
      },
      // 角色表单
      roleForm: {},
      // 权限选择
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 选中的权限
      selected: [],
      showAllNodes: false,
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            // pattern: window._check.isChineseReg,
            message: '请输入中文不能包含空格',
            trigger: 'blur'
          }
        ]
        // tree: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      dialogTiltle: '',
      // 分页默认
      currentPage: 1,
      pagesize: 5
    }
  },
  methods: {
    // 查询角色
    getRoleInfo () {
      const vm = this
      vm.tableData = []
      let pageIndex = vm.pageIndex
      vm.$request(
        `/system/role/roleInfo`,
        pageIndex
      ).then(data => {
        if (data.code === 200) {
          vm.tableData = data.data
        }
      })
    },
    // 删除角色
    deleteRole (res) {
      this.$confirm('是否确定删除此角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const vm = this
          vm.$request(
            `/system/role/deleteRole`,
            res
          ).then(data => {
            if (data.code === 200) {
              this.currentPage = 1
              vm.getRoleInfo()
            }
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    /* 角色表单弹窗操作：添加角色、修改角色;打开表单 */
    rolrData (statu, res) {
      let formData = JSON.parse(JSON.stringify(res))
      const vm = this
      vm.dialogVisible = true
      this.$nextTick(() => {
        if (statu === 0) {
          vm.dialogTiltle = '添加角色'
          vm.roleForm = vm.addroleForm
          vm.defaultData()
        } else {
          vm.dialogTiltle = '修改角色'
          vm.roleForm = formData
          vm.defaultData(res.list)
        }
      })
    },
    // 弹窗默认数据
    defaultData (res) {
      let arr = []
      if (res) {
        for (let item of res) {
          // 过滤父级
          if (item.parentId !== -1) {
            arr.push(item.authoriryId)
          }
        }
      }

      this.$refs.tree.setCheckedKeys(arr) // 设置树形控件默认选中项
    },
    // 角色弹窗点击确定按钮
    roleOk () {
      const vm = this
      vm.$refs.roleForm.validate(valid => {
        let checkedKeys = vm.$refs.tree.getCheckedKeys() // 获取当前的选中的节点
        let halfCheckedKeys = vm.$refs.tree.getHalfCheckedKeys() // 未全选的父级节点
        var key = halfCheckedKeys.concat(checkedKeys)

        if (valid && key !== 0) {
          var data = {
            roleName: vm.roleForm.roleName,
            description: vm.roleForm.description,
            nodes: key
          }
          if (vm.roleForm.id) {
            // 修改角色
            data.id = vm.roleForm.id
            let url = `/system/role/updateRole`
            vm.sendRequest(url, data)
          } else {
            // 添加角色
            let url = `/system/role/saveRole`
            vm.sendRequest(url, data)
            vm.addroleForm.roleName = ''
            vm.addroleForm.description = ''
          }
          vm.dialogVisible = false
        } else {
          vm.$message.error('请填写完表单')
        }
      })
    },
    // 调接口发送请求(添加用户,修改用户)
    sendRequest (url, data) {
      const vm = this

      vm.$request(url, JSON.stringify(data)).then(res => {
        if (res.code === 200) {
          this.$message({
            showClose: true,
            message: '成功！',
            type: 'success'
          })
          vm.getRoleInfo() // 刷新表格
        }
      })
    },
    // 角色弹窗点击取消按钮
    roleCancel () {
      const vm = this
      vm.dialogVisible = false
      vm.addroleForm.roleName = ''
      vm.addroleForm.description = ''
      vm.getRoleInfo() // 刷新表格
    },

    /* 显示所有权限列表 */
    getAllMenu () {
      const vm = this
      vm.$request(`/system/auth/authInfo`).then(
        res => {
          if (res.code === 200) {
            var list = res.data
            let treeAllData = vm.treeData

            // 遍历父级菜单
            vm.traversingList(list, treeAllData, -1)

            // 遍历子集菜单
            for (var j = 0; j < treeAllData.length; j++) {
              vm.traversingList(
                list,
                treeAllData[j].children,
                treeAllData[j].id
              )
            }
          }
        }
      )
    },
    // 遍历list
    traversingList (list, treeAllData, num) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].parentId === num) {
          treeAllData.push(this.displayMuem(i, list[i]))
        }
      }
    },
    // 显示菜单
    displayMuem (i, data) {
      var obj = {
        parentId: i,
        label: data.authName,
        id: data.id,
        children: []
      }
      return obj
    },
    // 分页方法
    handleSizeChange: function (size) {
      this.pagesize = size
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    isNull (row, column) {
      var type = row[column.property]
      return type === '' ? '--' : type
    }
  }
}
</script>
<style scoped>
.adduser {
  margin-bottom: 10px;
}
.user {
  margin-bottom: 5px;
}

.el-tree {
  height: 200px;
  overflow: auto;
}
</style>
