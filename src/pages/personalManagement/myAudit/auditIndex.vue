
<template>
  <div id="myAudit" class="component_wrap">
    <el-tabs :tab-position="tabPosition" style="height: 100%;" @tab-click="swichTab()" v-model="tabsIndex">

      <template v-for="(item_tabs,idx_tabs) in aTabs">
        <el-tab-pane :key="idx_tabs" :label="item_tabs" :name="item_tabs">
          <!-- 操作按钮：多个选中 -->
          <div class="btn_wrap" v-show="idx_tabs !== 2">
            <template v-for="(item_popover,idx_popover) in mulBtn">
              <zPopover :key="idx_popover" :ref="item_popover.refName" :title="item_popover.title" @cancel="MultipleCancel()"
                @ok="multipleOk(item_popover.bPass)">
                <el-button slot="btn" size="small" :type="item_popover.type"
                  @click.stop="handlePassMultiple({idx:idx_tabs,bPass:item_popover.bPass,refName:item_popover.refName})">
                  {{item_popover.bPass | formatPass}}
                </el-button>
              </zPopover>
            </template>
          </div>

          <!-- 表格组件 -->
          <auditTable ref="refTable" :auditType="item_tabs" :tableData="allList"></auditTable>
        </el-tab-pane>
      </template>

    </el-tabs>
  </div>
</template>

<script>
import zPopover from '@/components/common/popover.vue'
import auditTable from './auditTable.vue'

export default {
  name: 'myAudit',
  components: {
    zPopover,
    auditTable
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
      tabsIndex: '全部',
      tabPosition: 'left',
      allList: [],
      multipleSelection: [],
      mulBtn: [
        {
          slotName: 'btn',
          refName: 'passPopover',
          bPass: true,
          type: 'primary',
          title: `你确定通过所有已选中的题目吗？`
        },
        {
          slotName: 'btn',
          refName: 'noPassPopover',
          bPass: false,
          type: 'danger',
          title: `你确定不通过所有已选中的题目吗？`
        }
      ],
      aTabs: ['全部', '待审核', '已审核']
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
    formatPass (val) {
      if (val) {
        return '通过'
      } else {
        return '不通过'
      }
    }
  },
  created () {
    this.getAllExam()
  },
  mounted () { },
  methods: {
    swichTab () {
      this.$nextTick(() => {
        let key = this.tabsIndex
        console.log(key)
        let arr = this.saveList

        let filterData = arr.filter(item => {
          switch (key) {
            case '已审核':
              return item.auditStatus !== 2
            case '待审核':
              return item.auditStatus === 2
            default:
              return item
          }
        })

        console.log(filterData)

        this.allList = filterData
      })
    },
    // 获取题目列表
    getQuestion (bIsSelect) {
      let obj = this.$store.state.classTestBack

      return obj.getData(bIsSelect)
    },
    getAllExam () {
      let data = this.getQuestion()
      this.allList = data
      this.saveList = data
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
    MultipleCancel () { },
    // 批量通过
    multipleOk (b) {
      console.log(b, '批量通过')
      if (b) {

      } else {

      }
    },
    // 批量操作
    handlePassMultiple ({ idx, bPass, refName }) {
      let vm = this
      let popover = vm.$refs[refName][0]
      let data = vm.$refs.refTable[idx].getSelectData()
      popover.setVisible(false)
      console.log(data)
      if (data.length === 0) {
        vm.$message.error('请选择题目')
        popover.setVisible(true)
        return false
      }
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
#myAudit {
  padding-top: 20px;

  .el-table__body tr:hover > td {
    background-color: #e9eef3 !important;
    cursor: pointer;
  }
}

.el-tabs__content {
  height: 100%;

  & > div {
    height: 100%;
  }
}
</style>

<style lang="scss" scoped>
.btn_wrap {
  margin-bottom: 20px;
  div {
    display: inline-block;
    // margin-left: 15px;
  }
}
</style>
