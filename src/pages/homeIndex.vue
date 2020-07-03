<template>
  <div id="homeIndex" class="component_wrap">
    <el-tabs :tab-position="tabPosition" style="height: auto;">
      <el-tab-pane label="全部">
        <div>
          <zPopover :slotName="slotName">
            <el-button :slot="slotName" size="small" type="primary" @click.stop="handlePassMultiple(true)">通过</el-button>
          </zPopover>
          <zPopover :slotName="slotName">
            <el-button :slot="slotName" size="small" type="danger" @click="handlePassMultiple(false)">不通过</el-button>
          </zPopover>
        </div>

        <el-table ref="multipleTable" :data="allList" tooltip-effect="dark" style="width: 100%" :header-row-style="setHeaderStyle"
          :default-sort="{prop: 'submitDate', order: 'ascending'}" @selection-change="handleSelectionChange" @row-click="rowClick"
          :row-class-name="tableRowClassName">
          <el-table-column type="selection" width="50" align="center" fixed :selectable="selectable">
          </el-table-column>
          <el-table-column label="序号" type="index" width="50" align="center">
          </el-table-column>
          <el-table-column label="提交日期" prop="submitDate" width="100" show-overflow-tooltip align="center" sortable>
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
          <el-table-column label="操作/审核状态" width="200" fixed="right">
            <template slot-scope="scope">
              <!-- {{scope.row.auditStatus}} -->
              <div v-show="scope.row.auditStatus === 2">
                <el-button size="mini" type="primary" plain @click.stop="handlePass(scope.$index, scope.row,true)">通过</el-button>
                <el-button size="mini" type="danger" plain @click.stop="handlePass(scope.$index, scope.row,false)">不通过</el-button>
              </div>
              <el-tag :type="updateAuditStatus(scope.row.auditStatus)" v-show="scope.row.auditStatus !== 2">
                {{scope.row.auditStatus | formatAuditStatus}}</el-tag>
            </template>

          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="已审核">配置管理</el-tab-pane>
      <el-tab-pane label="待审核">角色管理</el-tab-pane>

    </el-tabs>

    <!-- 测试 -->
    <zPopover :slotName="slotName">
      <!-- <zPopover> -->
      <el-button :slot="slotName" size="mini" type="primary">通过</el-button>
    </zPopover>

    <!-- <div v-for="(item_list,idx_list) in allList" :key="idx_list">
      {{item_list}}
    </div> -->
  </div>
</template>

<script>
import zPopover from '@/components/common/popover.vue'
export default {
  name: 'homeIndex',
  components: {
    zPopover
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
      tabPosition: 'left',
      allList: [],
      multipleSelection: [],
      slotName: 'btn'
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
    }
  },
  created () {
    this.getAllExam()
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
    // 批量操作
    handlePassMultiple (b) {
      // this.$refs.popover.openDialog(true)

      console.log(this.multipleSelection)
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择题目')
        return false
      }

      this.$message.error('请选择题目')
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
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    }
  }
}
</script>
<style lang='scss' >
/* 添加表格hover样式 */
#homeIndex .el-table__body tr:hover > td {
  background-color: #e9eef3 !important;
  cursor: pointer;
}
</style>
