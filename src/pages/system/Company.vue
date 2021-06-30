<template>
  <div id="company">
    <div>
      <el-button type="primary" size="small" class="insert" @click="dialogFormVisible = true">新增企业</el-button>
    </div>
    <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width:100%" border :header-cell-style="{}">
      <el-table-column type="index" width="100" label="序号" align="center"></el-table-column>
      <el-table-column prop="label" label="企业名称" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">编辑</el-button>
          <el-button type="text" @click="openOrganization(scope.row.id)">组织架构</el-button>
          <el-button type="text" @click="deleteBusiness(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[5, 10, 20, 30, 40]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" prev-text="上一页" next-text="下一页"
      :total="tableData.length"></el-pagination>

    <!-- 新增企业的弹框 -->
    <el-dialog title="新增企业" center :close-on-click-modal="false" @close="cancel('editForm')" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="editForm" ref="editForm" :rules="rules2" label-width="120px">
        <el-form-item label="企业名称 :" prop="label">
          <el-input type="text" v-model="editForm.label" autocomplete="off" maxlength="30"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel(editForm)">取消新增</el-button>
        <el-button type="primary" @click="addBussiness">确认新增</el-button>
      </span>
    </el-dialog>
    <!-- 编辑企业的弹框 -->
    <el-dialog title="编辑企业" center :close-on-click-modal="false" @close="cancel2('editForm2')" :visible.sync="dialogFormVisible2"
      width="30%">
      <el-form :model="editForm2" ref="editForm2" :rules="rules2" label-width="120px">
        <el-form-item label="企业名称 :" prop="label">
          <el-input type="text" v-model="editForm2.label" autocomplete="off" maxlength="30"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel2(editForm2)">取消编辑</el-button>
        <el-button type="primary" @click="updateBussiness(editForm2)">保存编辑</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      name: '',
      dialogFormVisible: false,
      dialogFormVisible2: false,
      detailData: {},
      tableData: [{}],
      // 分页默认
      currentPage: 1,
      pagesize: 5,
      // 新增
      editForm: {
        label: ''
      },
      // 编辑
      editForm2: {
        label: ''
      },
      // 表单验证规则
      rules2: {
        label: [
          {
            required: true,
            message: '必填，并且长度小于30',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  created () {
    // this.$store.commit('changeBreadcumb', [], this.showAllbusiness())
  },
  methods: {
    // 打开组织架构
    openOrganization (id) {
      this.$router.push({
        name: 'organization',
        query: {
          id: id
        }
      })
    },
    // 初始化查询所有
    showAllbusiness () {
      const vm = this
      vm.tableData = []
      let data = {}
      vm.$request(`/company/getCompany`, data).then(
        data => {
          if (data.code === 200) {
            vm.tableData = data.data.companyMenuDtos
          }
        }
      )
    },

    // 编辑
    edit (row) {
      this.editForm2.label = row.label
      this.editForm2.id = row.id
      this.dialogFormVisible2 = true
    },
    // 保存编辑
    updateBussiness (data) {
      const vm = this
      let param = {
        name: data.label,
        id: data.id
      }
      vm.$refs.editForm2.validate(valid => {
        if (valid) {
          // (data, '编辑企业参数data')
          vm.tableData = []
          vm.$request(
            `/company/updateCompany`,
            param
          ).then(data => {
            if (data.code === 200) {
              // (data, '编辑企业后返回数据')
              vm.$message.success(data.msg)
              vm.showAllbusiness()
            }
            vm.dialogFormVisible2 = false
          })
        } else {
          vm.$message.error('表单填写不完整')
        }
      })
    },
    // 新增企业
    addBussiness () {
      const vm = this
      vm.$refs.editForm.validate(valid => {
        if (valid) {
          let data = {
            name: vm.editForm.label,
            parentId: 0
          }
          vm.$request(
            `/company/insertCompany`,
            data
          ).then(data => {
            if (data.code === 200) {
              vm.$message.warning(data.msg)
              vm.showAllbusiness()
            }
            vm.dialogFormVisible = false
          })
        } else {
          vm.$message.error('表单填写不完整')
        }
      })
    },
    // 取消编辑
    cancel2 () {
      const vm = this
      // 对该表单项进行重置，将其值重置为初始值并移除校验结果
      this.$refs.editForm2.resetFields()
      vm.dialogFormVisible2 = false
    },

    // 取消新增
    cancel () {
      let vm = this
      this.$refs.editForm.resetFields()
      vm.dialogFormVisible = false
    },
    // 删除企业信息
    deleteBusiness (id) {
      const vm = this
      let data = { id: id }
      this.$confirm('删除企业后，其组织结构也相应删除', '删除提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消删除',
        type: 'warning',
        center: true
      })
        .then(() => {
          vm.$request(
            `/company/deleteCompany`,
            data
          ).then(data => {
            if (data.code === 200) {
              this.currentPage = 1
              vm.$message({ message: data.msg, type: 'success' })
            }
            vm.showAllbusiness()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 分页方法
    handleSizeChange: function (size) {
      this.currentPage = 1
      this.pagesize = size
      // ('一页多少条' + size)
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      // ('当前页第' + currentPage)
    }
  }
}
</script>
<style scoped>
/* 新增企业 */
.insert {
  /* float: right; */
  margin-bottom: 10px;
}
</style>
