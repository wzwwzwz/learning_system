
<template>
  <div id="tableAudit" class="" v-loading.lock="bIsSubmit" :element-loading-text="loadingText">
    <el-form :rules="model.rules" :model="model" ref="tableAuditFrom">
      <el-table ref="multipleTable" :data="model.tableData" tooltip-effect="dark" border height="100%" style="width: 100%;height:100%"
        :header-row-style="setHeaderStyle" :cell-style="cellStyleFun" :default-sort="{prop: 'submitDate', order: 'ascending'}"
        @selection-change="handleSelectionChange" @row-click="rowClick" :row-class-name="tableRowClassName">

        <!-- 多选框 -->
        <el-table-column type="selection" width="50" align="center" fixed :selectable="selectable" disabled v-if="auditType !== '已审核'">
        </el-table-column>

        <el-table-column label="序号" type="index" width="50" align="center">
        </el-table-column>
        <el-table-column label="提交日期" prop="submitDate" width="110" show-overflow-tooltip align="center" sortable>
          <!-- <template slot-scope="scope">{{ scope.row.submitDate }}</template> -->
        </el-table-column>
        <el-table-column label="用户名" prop="userName" width="80" align="center">
        </el-table-column>
        <el-table-column label="题型" prop="bIsjudgeQue" width="70" align="center" :formatter='formatExamType'>
        </el-table-column>

        <el-table-column label="知识点" prop="knowledgePoint" show-overflow-tooltip :formatter='formatKnowledgePoint'>
        </el-table-column>
        <el-table-column label="答案" prop="answer" width="50" align="center" :formatter='formatAnswer'>
        </el-table-column>
        <el-table-column label="题目" prop="title" min-width="200">
        </el-table-column>
        <el-table-column label="选项" prop="options" min-width="100">
          <template slot-scope="scope">
            <!-- ${item_op.key}.${item_op.value} -->
            <template v-if="scope.row.bIsjudgeQue === false">
              <p v-for="(item_op,idx_op) in scope.row.options" :key="idx_op">{{item_op.key}}.{{item_op.value}}</p>
            </template>
            <template v-else>
              <p>正确</p>
              <p>错误</p>
            </template>
          </template>
        </el-table-column>

        <!-- 题目等级 -->
        <!-- <el-table-column label="难度" prop="qusLevel" width="50" align="center" fixed="right" :formatter='formatQusLevel'>
        </el-table-column> -->

        <el-table-column label="题目等级" fixed="right" min-width="100">
          <template slot-scope="scope">
            <template v-if="scope.row.auditStatus === 2">
              <!-- {{scope.$index}} -->
              <el-form-item :prop="'tableData.' + scope.$index + '.qusLevel'" :rules="model.rules.grade">
                <el-select v-model="scope.row.qusLevel" placeholder="请选择题目级别" size="mini">
                  <el-option v-for="item_level in getArrQusLevel" :key="item_level" :label="item_level" :value="item_level"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-else>{{scope.row.qusLevel | formatQusLevel}}</template>
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column :label="auditType | formatAuditTypeHeader" width="200" fixed="right" v-show="auditType !== '已审核'">
          <template slot-scope="scope">
            <!-- {{scope.row.auditStatus}} -->
            <div v-show="scope.row.auditStatus === 2">
              <el-button size="mini" type="primary" @click.stop="handlePass({idx:scope.$index, data:scope.row,bPass:true})">收进题库
              </el-button>
              <el-button size="mini" type="danger" @click.stop="handlePass(scope.$index, scope.row,false)" v-show="auditType !== '已审核'">不通过
              </el-button>
            </div>
            <el-tag :type="updateAuditStatus(scope.row.auditStatus)" v-show="scope.row.auditStatus !== 2">
              {{scope.row.auditStatus | formatAuditStatus}}</el-tag>
          </template>
        </el-table-column>

      </el-table>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isBoolean } from '@/utils/validate'

export default {
  name: 'auditTable',
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
  watch: {
    tableData (val) {
      this.model.tableData = this.tableData
    }
  },
  components: {
  },
  computed: {
    ...mapGetters(['getArrQusLevel']),
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
      bIsSubmit: false,
      loadingText: '正在等待确定',
      allList: [],
      multipleSelection: [],
      model: {
        rules: {
          grade: {
            required: true,
            message: '请选择题目级别',
            trigger: ['blur', 'change']
          }
        },
        tableData: this.tableData
      }
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
    },
    formatQusLevel (val) {
      if (val) {
        return val
      } else {
        return '--'
      }
    }
  },
  created () {
    this.getAllExam()
    console.log('我的审核created', this.model.tableData)
  },
  beforeMount: function () {

  },
  mounted () {

  },
  beforeUpdate: function () {
    // console.log('beforeUpdate:组件更新前,页面仍未更新,但虚拟Dom已经配置', this)
  },
  updated: function () {
    // console.log('updated:组件更新,此方法执行后,页面显示', this)
  },

  methods: {
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
    formatQusLevel (row, column, cellValue) {
      if (cellValue) {
        return cellValue
      } else {
        return '--'
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
    // 获取题目列表
    getQuestion (bIsSelect) {
      let obj = this.$store.state.classTestBack

      return obj.getData(bIsSelect)
    },
    getAllExam () {
      this.allList = this.getQuestion()
    },
    setHeaderStyle ({ row, rowIndex, column }) {
      return ''
    },
    cellStyleFun ({ row, column, rowIndex, columnIndex }) {
      const aNoCenter = ['options', 'title']
      if (aNoCenter.includes(column.property)) {
        return ''
      } else {
        return ''
        // return 'text-align: center;'
      }
    },
    handlePass ({ bPass, idx, data }) {
      // console.log(bPass, idx, data)
      let vm = this
      let swicth = true

      if (bPass) {
        vm.$refs['tableAuditFrom'].validateField(`tableData.${idx}.qusLevel`, (errorMessage) => {
          console.log(errorMessage)
          if (errorMessage) {
            swicth = false
            return false
          }
        })
      }

      if (swicth) {
        vm.$emit('itemOperation', { bPass, data })
      }
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
    /**
     * @description
     * @param { Boolean } b true === pass ||  false === noPass
     * @returns { Array || false }  false === 有未选择的表单 || Array === 选中的条目
     **/
    getSelectData (b, success, error) {
      if (!isBoolean(b)) {
        return
      }

      let vm = this
      let res = vm.multipleSelection

      if (vm.multipleSelection.length === 0) {
        return []
      }

      if (b) {
        let validateArr = []
        vm.multipleSelection.forEach((item) => {
          validateArr.push(`tableData.${item.index}.qusLevel`)
        })
        vm.$refs['tableAuditFrom'].validateField(validateArr, (errorMessage) => {
          // console.log(errorMessage)
          if (errorMessage) {
            res = false
          }
        })

        return res
      } else {
        return res
      }
    },
    clearFormVerification () {
      if (this.$refs['tableAuditFrom']) {
        this.$refs['tableAuditFrom'].resetFields()
      }
    },
    addLoadding (b) {
      if (!isBoolean(b)) {
        return false
      }

      this.bIsSubmit = b
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
