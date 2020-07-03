<template>
  <div id="auth" class="component_wrap">
    <div class="user">
      <el-button type="primary" class="adduser" size="small" @click="rolrData(0, roleForm)">添加用户</el-button>
    </div>

    <!-- 所有用户表格开始 -->
    <el-table :data="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)" border>
      <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
      <el-table-column prop="roleName" label="用户名称" align="center"></el-table-column>
      <el-table-column prop="auth" label="用户描述" align="center" :formatter="formatDes"></el-table-column>
      <!-- <el-table-column prop="description" label="用户描述" width="500" align="center" :formatter="isNull"></el-table-column> -->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain size="small" @click="rolrData(1, scope.row)">修改用户</el-button>
          <el-button type="danger" plain size="small" @click.prevent="deleteRole(scope.row.id)">删除用户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 所有用户表格开始结束 -->

    <!-- 用户操作dialog弹框开始 -->
    <el-dialog :title="dialogTiltle" :visible.sync="dialogVisible" :close-on-click-modal="false" width="50%">
      <el-form label-width="80px" :model="roleForm" :rules="rules" ref="roleForm">
        <el-form-item label="用户名称" prop="roleName">
          <el-input type="text" v-model="roleForm.roleName" clearable maxlength="15"></el-input>
        </el-form-item>
        <!-- <el-form-item label="用户描述" prop="description">
          <el-input type="text" maxlength="15" v-model="roleForm.description" clearable></el-input>
        </el-form-item> -->

        <!--权限选择 -->
        <el-form-item label="权限选择" prop="auth">
          <el-radio-group v-model="roleForm.auth" @change="authChg">
            <template v-for="item in arrAuthority.arr">
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
    <!-- 用户操作dialog弹框结束 -->

    <!-- 分页显示 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[5, 10, 20, 30, 40]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length" background
      style="margin-top:10px;"></el-pagination>
  </div>
</template>
<script>
// 测试文件
import TestDate from '@/utils/testFiles/testData'

export default {
  created () {
    //   this.$store.commit('changeBreadcumb', this.breadcrumb)
    // 测试数据
    let data1 = {
      description: '',
      roleName: '开始',
      auth: 3
    }

    this.testfun.add(data1)

    let data2 = {
      description: '',
      roleName: '开始2',
      auth: 1
    }
    this.testfun.add(data2)
    // 测试数据结束

    this.getRoleInfo()
  },
  data () {
    return {
      // 测试函数
      testfun: new TestDate(),
      // 添加用户
      input: '',
      dialogVisible: false,
      pageIndex: 0,
      tableData: [],
      // 面包屑
      breadcrumb: [{
        name: '系统管理',
        path: ''
      },
      {
        name: '用户管理',
        path: ''
      }
      ],
      // 单选按钮组
      arrAuthority: {
        defalutIdx: 3,
        arr: [{
          idx: 1,
          val: '管理员'
        },
        {
          idx: 2,
          val: '评审员'
        },
        {
          idx: 3,
          val: '普通用户'
        }
        ]
      },
      // 用户表单添加
      roleFormAdd: {
        roleName: '',
        description: '',
        auth: 3
      },
      // 用户表单
      roleForm: {},
      // 校验规则
      rules: {
        roleName: [{
          required: true,
          message: '请输入用户名称',
          trigger: 'blur'
        },
        {
          //   pattern: window._check.isChineseReg,
          message: '请输入中文不能包含空格',
          trigger: 'blur'
        }
        ],
        auth: [
          { required: true, message: '请选择权限', trigger: 'change blur' }
        ]
      },
      dialogTiltle: '',
      // 分页默认
      currentPage: 1,
      pagesize: 5
    }
  },
  methods: {
    authChg (value) {
      console.log(value, this.arrAuthority.defalutIdx)
    },
    // 查询用户
    getRoleInfo () {
      const vm = this
      vm.tableData = []
      // let pageIndex = vm.pageIndex
      // vm.$post(
      //   `${vm.$store.state.basicsReqURL}/system/role/roleInfo`,
      //   pageIndex
      // ).then(data => {
      //   if (data.code === 200) {
      //     vm.tableData = data.data
      //   }
      // })

      // 测试数据
      vm.tableData = vm.testfun.getData()
    },
    // 删除用户
    deleteRole (res) {
      this.$confirm('是否确定删除此用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const vm = this
          // vm.$post(
          //   //   `${vm.$store.state.basicsReqURL}/system/role/deleteRole`,
          //   res
          // ).then(data => {
          //   if (data.code === 200) {
          //     this.currentPage = 1
          //     vm.getRoleInfo()
          //   }
          // })

          var data = vm.testfun.delete(res)
          if (data) {
            // this.$message({
            //   type: 'success',
            //   message: '删除成功!'
            // })
            vm.getRoleInfo()
          }
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
    /* 用户表单弹窗操作：添加用户、修改用户;打开表单 */
    rolrData (statu, res) {
      let formData = JSON.parse(JSON.stringify(res))
      const vm = this
      vm.dialogVisible = true
      this.$nextTick(() => {
        // 清除表单校验
        vm.$refs.roleForm.resetFields()
        if (statu === 0) {
          vm.dialogTiltle = '添加用户'
          vm.roleForm = JSON.parse(JSON.stringify(vm.roleFormAdd))
          vm.defaultData()
        } else {
          vm.dialogTiltle = '修改用户'
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
      // this.$refs.tree.setCheckedKeys(arr) //设置树形控件默认选中项
    },
    // 用户弹窗点击确定按钮
    roleDialogOk () {
      const vm = this
      vm.$refs.roleForm.validate(valid => {
        if (valid) {
          var data = {
            roleName: vm.roleForm.roleName,
            description: vm.roleForm.description,
            auth: vm.roleForm.auth
          }

          if (vm.roleForm.id) {
            // 修改用户
            data.id = vm.roleForm.id
            //   let url = `${vm.$store.state.basicsReqURL}/system/role/updateRole`
            let url = ''
            vm.sendRequest(url, data)
          } else {
            // 添加用户
            //   let url = `${vm.$store.state.basicsReqURL}/system/role/saveRole`
            let url = ''
            vm.sendRequest(url, data)
            vm.roleFormAdd.roleName = ''
            vm.roleFormAdd.description = ''
            // vm.roleFormAdd.auth = ''
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

      // 请求数据
      // vm.$post(url, JSON.stringify(data)).then(res => {
      //   if (res.code === 200) {
      //     this.$message({
      //       showClose: true,
      //       message: '成功！',
      //       type: 'success'
      //     })
      //     // vm.getRoleInfo()
      //   }
      // })

      // 测试数据
      if (data.id) {
        vm.testfun.update(data)
      } else {
        vm.testfun.add(data)
      }
      vm.getRoleInfo()
    },
    // 用户弹窗点击取消按钮
    roleDialogCancel () {
      const vm = this
      vm.dialogVisible = false
      vm.roleFormAdd.roleName = ''
      vm.roleFormAdd.description = ''
      // vm.getRoleInfo() // 刷新表格
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
    },
    formatDes (row, column) {
      var type = row[column.property]
      let reVal = '无效权限'
      for (let item of this.arrAuthority.arr.values()) {
        if (item.idx === type) {
          reVal = item.val
          break
        }
      }
      return reVal
    }
  }
}

</script>
<style scoped>
#auth {
  /* margin: auto 20px; */
}

.adduser {
  margin-bottom: 10px;
}

.user {
  margin-bottom: 5px;
}

/* 分页 */
.el-pagination {
  display: flex;
  justify-content: flex-end;
}

.el-tree {
  height: 200px;
  overflow: auto;
}
</style>
