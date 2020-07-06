
<template>
  <div id="tableAudit" class="">
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" border max-height="" height="100%" style="width: 100%;height:100%"
      :header-row-style="setHeaderStyle" :default-sort="{prop: 'submitDate', order: 'ascending'}" @selection-change="handleSelectionChange"
      @row-click="rowClick" :row-class-name="tableRowClassName">

      <!-- 多选框 -->
      <el-table-column type="selection" width="50" align="center" fixed :selectable="selectable" v-if="auditType !== '已审核'">
      </el-table-column>

      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
      <el-table-column label="提交日期" prop="submitDate" width="110" show-overflow-tooltip align="center" sortable>
        <!-- <template slot-scope="scope">{{ scope.row.submitDate }}</template> -->
      </el-table-column>
      <el-table-column label="用户名" prop="userName" width="80">
      </el-table-column>
      <el-table-column label="题型" prop="bIsjudgeQue" width="70" :formatter='formatExamType'>
      </el-table-column>
      <el-table-column label="难度" prop="type" width="50">
      </el-table-column>
      <el-table-column label="知识点" prop="knowledgePoint" show-overflow-tooltip :formatter='formatKnowledgePoint'>
      </el-table-column>
      <el-table-column label="答案" prop="answer" width="50" :formatter='formatAnswer'>
      </el-table-column>
      <el-table-column label="题目" prop="title" min-width="200">
      </el-table-column>
      <el-table-column label="选项" prop="options" min-width="100">
        <template slot-scope="scope">
          <p v-for="(item_op,idx_op) in scope.row.options" :key="idx_op">{{item_op.key}}.{{item_op.value}}</p>
        </template>
      </el-table-column>
      <el-table-column :label="auditType | formatAuditTypeHeader" width="200" fixed="right" v-show="auditType !== '已审核'">
        <template slot-scope="scope">
          <!-- {{scope.row.auditStatus}} -->
          <div v-show="scope.row.auditStatus === 2">
            <el-button size="mini" type="primary" @click.stop="handlePass(scope.$index, scope.row,true)">通过
            </el-button>
            <el-button size="mini" type="danger" @click.stop="handlePass(scope.$index, scope.row,false)" v-show="auditType !== '已审核'">不通过
            </el-button>
          </div>
          <el-tag :type="updateAuditStatus(scope.row.auditStatus)" v-show="scope.row.auditStatus !== 2">
            {{scope.row.auditStatus | formatAuditStatus}}</el-tag>
        </template>

      </el-table-column>
    </el-table>

  </div>
</template>

<script>

export default {
  name: 'myAudit',
  props: {
    // 审核分类
    auditType: {
      type: String,
      default: () => ''
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  components: {

  },
  computed: {
    updateAuditStatus () {
      return function name (val) {
        switch (val) {
          case 1:
            return 'success'
          case 0:
            return 'danger'
          default:
            break
        }
      }
    }
  },
  data () {
    return {
      allList: [],
      multipleSelection: []
    }
  },
  filters: {
    formatAuditStatus (val) {
      switch (val) {
        case 1:
          return '已通过'
        case 0:
          return '未通过'
        default:
          break
      }
    },
    formatAuditTypeHeader (val) {
      switch (val) {
        case '已审核':
          return '审核状态'
        case '待审核':
          return '单项操作'
        default:
          return '单项操作/审核状态'
      }
    }
  },
  created () {
    this.getAllExam()
    console.log(this.auditType)
  },
  mounted () { },
  methods: {
    // 获取题目列表
    getQuestion (bIsSelect) {
      let obj = this.$store.state.classTestBack

      return obj.getData(bIsSelect)
    },
    getAllExam () {
      this.allList = this.getQuestion()
    },
    formatExamType (row, column, cellValue) {
      if (cellValue) {
        return '判断题'
      } else {
        return '选择题'
      }
    },
    formatAnswer (row, column, cellValue) {
      if (row.bIsjudgeQue) {
        if (cellValue) {
          return '正确'
        } else {
          return '错误'
        }
      } else {
        return cellValue
      }
    },
    formatKnowledgePoint (row, column, cellValue) {
      let val = ''
      let len = row.knowledgePoint.length
      for (let [idx, item] of row.knowledgePoint.entries()) {
        if (idx !== len - 1) {
          val += `${item},`
        } else {
          val += `${item}`
        }
      }
      return val
    },
    setHeaderStyle ({ row, rowIndex }) {
      return ''
    },
    handlePass (idx, data, bPass) {
      console.log(idx, data)
    },
    handleSelectionChange (val) {
      // console.log(val)
      this.multipleSelection = val
    },
    selectable (row, index) {
      if (row.auditStatus === 2) {
        return true
      } else {
        return false
      }
    },
    // 表格行点击方法
    rowClick (row, column, event) {
      if (row) {
        if (row.auditStatus === 2) {
          console.log(row)
          this.$refs.multipleTable.toggleRowSelection(row)
        }
      }
    },
    tableRowClassName ({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex
    },
    getSelectData () {
      return this.multipleSelection
    }
  }
}
</script>
<style lang='scss' >
/* 添加表格hover样式 */
#tableAudit {
  height: calc(100% - 100px);

  &.el-table__body tr:hover > td {
    background-color: #e9eef3 !important;
    cursor: pointer;
  }
}
</style>

<style lang="scss" scoped>
</style>
