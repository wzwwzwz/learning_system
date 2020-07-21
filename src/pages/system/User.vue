<template>
  <div id="user" class="component_wrap">

    <div class="btn_add_user_wrap">
      <el-button type="primary" class="btn_add_user" size="small" @click="rolrData(0, {})">添加用户</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)" border>
      <el-table-column type="index" label="序号" align="center" width="50" fixed="left"></el-table-column>
      <el-table-column label="用户名称" prop="roleName" align="center" fixed="left"></el-table-column>
      <el-table-column label="权限" prop="auth" align="center" fixed="left" :formatter="formatDes"></el-table-column>

      <!-- 后续添加 -->
      <!-- <el-table-column label="用户姓" prop="surname" align="center"></el-table-column>
      <el-table-column label="用户名" prop="persionname" align="center"></el-table-column> -->
      <el-table-column label="全名" align="center" :formatter="formatFullName">
      </el-table-column>

      <el-table-column label="性别" prop="gender" align="center" width="50" :formatter="formatGender"></el-table-column>
      <el-table-column label="年龄" prop="age" align="center" width="50"></el-table-column>
      <el-table-column label="入职时间" prop="onboarding" align="center" width="100"></el-table-column>
      <el-table-column label="所属部门" prop="department" align="center"></el-table-column>
      <el-table-column label="联系电话" prop="phone" align="center" width="110"></el-table-column>
      <el-table-column label="邮箱" prop="email" align="center" width="180"></el-table-column>
      <el-table-column label="描述" prop="descript" align="center" show-overflow-tooltip=true></el-table-column>

      <!-- 表格操作 -->
      <el-table-column label="操作" align="center" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" plain size="small" @click="rolrData(1, scope.row)">修改</el-button>
          <el-button type="danger" plain size="small" @click.prevent="deleteRole(scope.row.id)">删除</el-button>
          <el-button type="danger" size="small" @click="resetPassword(scope.row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 表单Dialog -->
    <UserDialog ref="userDialog"></UserDialog>

    <!-- 分页显示 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[5, 10, 20, 30, 40]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length" background
      style="margin-top:10px;"></el-pagination>
  </div>
</template>
<script>
// 测试文件
import TestDate from '@/utils/testFiles/testData'
import { mapGetters } from 'vuex'

const UserDialog = () => import('@/pages/system/components/UserDialog')

export default {
  name: 'user',
  components: {
    UserDialog
  },
  computed: {
    ...mapGetters(['getArrUserType', 'getBasicsReqURL'])
  },
  created () {
    // 测试数据
    let data1 = {
      auth: 3,
      surname: '李',
      persionname: '四',
      roleName: '123例子',
      gender: 0,
      age: '18',
      onboarding: '2011-11-1',
      department: '研发部',
      phone: '13755669933',
      email: '23674992@qq.con',
      descript: '就是个普通用户'
    }

    this.testfun.add(data1)

    let data2 = {
      auth: 1,
      surname: '周',
      persionname: '三',
      roleName: '例子2',
      gender: 1,
      age: '20',
      onboarding: '2011-07-01',
      department: '电子部门',
      phone: '13866999433',
      email: '2368596992@qq.con',
      descript: '机器人'
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
      pageIndex: 0,
      tableData: [],
      // 分页默认
      currentPage: 1,
      pagesize: 5
    }
  },
  methods: {
    // 查询用户
    getRoleInfo () {
      const vm = this
      vm.tableData = []
      // let pageIndex = vm.pageIndex
      // vm.axios.post(
      //   `${vm.getBasicsReqURL}/system/role/roleInfo`,
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
          // vm.axios.post(
          //   //   `${vm.getBasicsReqURL}/system/role/deleteRole`,
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
      this.$refs.userDialog.userAction(statu, res)
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

    // 调接口发送请求(添加用户,修改用户)
    sendRequest (url, data) {
      const vm = this

      // 请求数据
      // vm.axios.post(url, JSON.stringify(data)).then(res => {
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
    // 重置密码
    resetPassword (row) {
      const vm = this
      let id = row.id
      vm.$confirm(`重置用户:${row.roleName}的密码?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.isLoading = true
        let objData = new vm.$dataProcess.RequestParams('set_user_psw')
        objData.setParams({
          key: id,
          psw: ''
        })

        let encryptedData = objData.getEncryptData()
        objData.setDecryptData('dfdsg')

        let jiemi = objData.getParams()
        console.log(encryptedData, jiemi)

        // vm.$post(`${vm.getBasicsReqURL}`, encryptedData).then(r => {
        //   if (r && r.code === 200) {
        //     vm.$message({ message: `${r.msg}`, type: 'success' })
        //     vm.showAllUserInfo()
        //   }
        //   vm.isLoading = false
        // })
      })
    },
    // 分页方法
    handleSizeChange: function (size) {
      this.pagesize = size
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    // 表格格式化
    formatDes (row, column) {
      var type = row[column.property]
      let reVal = '无效权限'
      for (let item of this.getArrUserType.values()) {
        if (item.idx === type) {
          reVal = item.val
          break
        }
      }
      return reVal
    },
    formatGender (row, column) {
      var val = row[column.property]
      if (val === 1) {
        return '男'
      } else {
        return '女'
      }
    },
    formatFullName (row, column) {
      // var val = row[column.property]
      return `${row.surname}${row.persionname}`
    }
  }
}

</script>
<style lang="scss" scoped>
#user {
  padding: 0;
  .btn_add_user_wrap {
    margin-bottom: 5px;

    .btn_add_user {
      margin-bottom: 10px;
    }
  }
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
