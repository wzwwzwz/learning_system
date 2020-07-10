
<template>
  <div id="myAudit" class="component_wrap">
    <el-tabs :tab-position="tabPosition" style="height: auto;" @tab-click="swichTab()" v-model="tabsIndex">

      <template v-for="(item_tabs,idx_tabs) in aTabs">
        <el-tab-pane :key="idx_tabs" :label="item_tabs" :name="item_tabs">
          <!-- 操作按钮：多个选中 -->
          <div class="btn_wrap" v-show="idx_tabs !== 2">
            <template v-for="(item_popover,idx_popover) in mulBtn">
              <zPopover :key="idx_popover" :ref="item_popover.refName" :title="item_popover.title" :class="'auditPopover'"
                @cancel="MultipleCancel()" @ok="multipleOk(item_popover.bPass)">
                <el-button slot="btn" size="small" :type="item_popover.type"
                  @click.stop="handlePassMultiple({idx:idx_tabs,bPass:item_popover.bPass,refName:item_popover.refName})">
                  {{item_popover.bPass | formatPass}}
                </el-button>
              </zPopover>
            </template>
          </div>

          <!-- 表格组件 -->
          <!-- <auditTable ref="refTable" :auditType="item_tabs" :tableData="allList"></auditTable> -->
        </el-tab-pane>

      </template>
    </el-tabs>

    <!-- 动态挂载 -->
    <component :is="isComponent" ref="refTable" :auditType="tabsIndex" :tableData="allList" @itemOperation="handlePassSingle($event)">
    </component>

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
    isComponent () {
      let zcom = this.componentsList[this.activeName]
      console.log(zcom)
      // return zcom
      return 'auditTable'
    },
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
      activeName: 'first',
      componentsList: {
        first: 'auditTable', // 需要引入具体的组件
        second: 'auditTable',
        third: 'auditTable',
        four: 'auditTable'
      },
      // 测试
      tabsIndex: '全部',
      tabPosition: 'top',
      allList: [],
      multipleSelection: [],
      mulBtn: [
        {
          slotName: 'btn',
          refName: 'passPopover',
          bPass: true,
          type: 'primary',
          title: `你确定批量通过所有已选中的题目吗？`
        },
        {
          slotName: 'btn',
          refName: 'noPassPopover',
          bPass: false,
          type: 'danger',
          title: `你确定批量不通过所有已选中的题目吗？`
        }
      ],
      // , '待审核', '已审核'
      aTabs: ['全部', '待审核', '已审核'],
      arrComponent: [{
        name: 'auditTable'
      }, {
        name: 'auditTable'
      },
      {
        name: 'auditTable'
      }]
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
        return '收进题库'
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
      // this.$nextTick(() => {
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
      this.$refs.refTable.clearFormVerification()

      // })
    },
    // 获取题目列表
    getQuestion (bIsSelect) {
      let obj = this.$store.state.classTestBank

      return obj.getData(bIsSelect)
    },
    getAllExam () {
      let data = this.getQuestion()
      this.allList = data
      this.saveList = data
    },
    MultipleCancel () {
      this.$refs.refTable.addLoadding(false)
    },
    // 批量通过
    multipleOk (b) {
      console.log(b, '批量通过')
      if (b) {

      } else {

      }
    },
    handlePassSingle (param) {
      console.log('handlePassSingle', param)
    },
    // 批量操作
    handlePassMultiple ({ idx, bPass, refName }) {
      let vm = this
      let popover = vm.$refs[refName][idx]
      // let data = vm.$refs.refTable[idx].getSelectData()
      let data = vm.$refs.refTable.getSelectData(bPass)
      popover.setVisible(false)
      console.log('handlePassMultiple', data)

      if (data === false) {
        vm.$message.error('请完成必要的选项')
        popover.setVisible(true)
        return false
      }

      if (data.length === 0) {
        vm.$message.error('请选择题目')
        popover.setVisible(true)
        return false
      }

      vm.$refs.refTable.addLoadding(true)
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

.auditPopover {
  display: inline-block;

  &:not(:first-child) {
    margin-left: 15px;
  }
}
</style>
