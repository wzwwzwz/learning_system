<template>
  <div id="user" class="component_wrap">

    <el-row :gutter="20" class="user_top_wrap">

      <el-col :span="10">
        <!-- 搜索 -->
        <el-input placeholder="请输入内容" v-model="searchInput" class="input-with-select" clearable
          @keyup.enter.native="search(searchInput,searchSelect)">
          <el-select v-model="select" slot="prepend" placeholder="请选择" clearable>
            <el-option label="餐厅名" value="1"></el-option>
            <el-option label="订单号" value="2"></el-option>
            <el-option label="用户电话" value="3"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="search(searchInput,searchSelect)"></el-button>
        </el-input>
      </el-col>

      <el-col :span="6">
        <!-- 添加 -->
        <el-button type="primary" class="btn_add_user" size="medium" @click="updateUser(0, {})">添加用户</el-button>
      </el-col>

    </el-row>

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
      <el-table-column label="描述" prop="descript" align="center" :show-overflow-tooltip="true"></el-table-column>

      <!-- 表格操作 -->
      <el-table-column label="操作" align="center" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" plain size="small" @click="updateUser(1, scope.row)">修改</el-button>
          <el-button type="danger" plain size="small" @click.prevent="deleteUser(scope.row.key)">删除</el-button>
          <el-button type="danger" size="small" @click="resetPassword(scope.row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 表单Dialog -->
    <UserDialog ref="userDialog" @ok="dialogOk($event)"></UserDialog>

    <!-- 分页显示 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[5, 10, 20, 30, 40]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length"
      background>
    </el-pagination>
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
      key: '修改用户的key1',
      roleName: '123例子',
      auth: 3,
      surname: '李',
      persionname: '四',
      gender: 0,
      age: 18,
      onboarding: '2011-11-21',
      department: '研发部',
      phone: '13755669933',
      email: '23674992@qq.con',
      descript: '就是个普通用户'
    }

    this.testfun.add(data1)

    let data2 = {
      key: '修改用户的key2',
      auth: 1,
      surname: '周',
      persionname: '三',
      roleName: '例子2',
      gender: 1,
      age: 2,
      onboarding: '2018-07-21',
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
      // 搜索
      searchInput: '',
      searchSelect: '',
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
    search (searchInput, searchSelect) {
      console.log(searchInput, searchSelect)
    },
    // 查询用户
    getRoleInfo () {
      const vm = this
      vm.tableData = []
      // let pageIndex = vm.pageIndex
      // vm.$request(
      //   `/system/role/roleInfo`,
      //   pageIndex
      // ).then(data => {
      //   if (data.code === 200) {
      //     vm.tableData = data.data
      //   }
      // })

      // 测试数据
      vm.tableData = vm.testfun.getData()
    },
    /**
     * @description 删除用户
     * @param { String } key 用户key
    **/
    deleteUser (key) {
      this.$confirm('是否确定删除此用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const vm = this
        let objData = new vm.$dataProcess.Parameter()
        objData.setFunc('del_user')
        objData.setParams({ key })

        let param = objData.getJson()
        console.log(param)

        // vm.$request(
        //   //   `/system/role/deleteUser`,
        //   res
        // ).then(data => {
        //   if (data.code === 200) {
        //     this.currentPage = 1
        //     vm.getRoleInfo()
        //   }
        // })

        var data = vm.testfun.delete(key)
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /* 用户表单弹窗操作：添加用户、修改用户;打开表单 */
    updateUser (statu, res) {
      this.$refs.userDialog.userAction(statu, res)
    },
    dialogOk ({ statu, data }) {
      console.log('ok回调', statu, data)
      this.tableData = data
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
      // vm.$request(url, JSON.stringify(data)).then(res => {
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
        let objData = new vm.$dataProcess.Parameter('set_user_psw')
        objData.setParams({
          key: id,
          psw: ''
        })

        this.$request('url', { data: objData.getJson() }).then((res) => {
          console.log('ok', res)
          //   if (r && r.code === 200) {
          //     vm.$message({ message: `${r.msg}`, type: 'success' })
          //     vm.showAllUserInfo()
          //   }
          //   vm.isLoading = false
        }).catch((error) => {
          console.log('error', error)
        })
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
  .user_top_wrap {
    margin-bottom: 15px;

    // .btn_add_user {
    //   // margin-bottom: 10px;
    // }
  }
}

.el-tree {
  height: 200px;
  overflow: auto;
}
</style>

<style lang="scss">
#user {
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
