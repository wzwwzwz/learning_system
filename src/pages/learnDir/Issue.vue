<template>
  <div id="learnDir">
    <btn-Grp :objData="oBtnGrpInfo" @btnGrpClick="selectType($event)"></btn-Grp>

    <!-- 表格 -->
    <div class="table">
      <template>
        <el-divider content-position="left">
          <el-tag v-for="(item,index) in aTypeTags" :key="index" :closable="index !== 0" type="info" class="typeTags"
            @close="handleClose(index)">{{item}}
          </el-tag>

          <!-- <el-tag type="info" >全部</el-tag>
          <el-tag type="info" closable v-show="typeName !== ''" @close="handleClose(typeName)">{{typeName}}</el-tag> -->
        </el-divider>
      </template>

      <!-- 添加一条 -->
      <el-button type="text" icon="el-icon-edit" @click="addLearnQus()" style="float: right;">添加一条</el-button>
      <!-- 出题表单弹框 -->
      <AddIssue ref="addIssueForm"></AddIssue>

      <!-- list -->
      <template>
        <el-table ref="filterTable" :data="tableData" style="width: 100%" @row-click="rowClick" :cell-class-name="setTableCellClass">
          <el-table-column type="index" label="序号" width="50" align="left"></el-table-column>
          <el-table-column prop="title" label="题目" width="500"></el-table-column>
          <el-table-column prop="descript" label="描述" :show-overflow-tooltip=true></el-table-column>
          <el-table-column prop="knowledgePoint" label="知识点" width="180"></el-table-column>
          <el-table-column class="ditInfo" width="80" :hoverShow="true" prop="view">查看回答</el-table-column>
        </el-table>
      </template>

    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import * as check from '@/utils/validate'

const btnGrp = () => import('@/components/common/btnGrp.vue')
const AddIssue = () => import('./AddIssue.vue')

export default {
  name: '',
  components: {
    btnGrp,
    AddIssue
  },
  computed: {
    ...mapGetters(['getKnowledgePoint'])
  },
  created () {
    let vm = this
    // 获取论点
    vm.$emit('getIssue', {
      param: {},
      success: function (res) {
        let objData = new vm.$dataProcess.Parameter()
        objData.setJson(res)

        let data = objData.getParams()
        vm.tableData = data
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  data () {
    return {
      typeName: '',
      aTypeTags: ['全部'],
      oBtnGrpInfo: {
        titleName: '知识点分类',
        aBtn: this.$store.getters.getKnowledgePoint
      },
      tableData: [
        // {
        //   key: '论点的key_123',
        //   status: 1451, // 状态，最佳答案的KEY，如果为空，则表示未完成
        //   title: '什么时色温？',
        //   knowledgePoint: '8596',
        //   descript: '这只是一个小描述'
        // }, {
        //   key: '124',
        //   status: 1452,
        //   title: '什么是LED亮度？',
        //   knowledgePoint: '行业产品',
        //   descript: '烦躁的描述'
        // }, {
        //   key: '125',
        //   status: 1453,
        //   title: '世界论',
        //   knowledgePoint: '产品应用场景',
        //   descript: '简单描述'
        // }, {
        //   key: '1236',
        //   status: 1454,
        //   title: '黑洞讨论',
        //   knowledgePoint: '产品目的',
        //   descript: '一般的描述'
        // }
      ]
    }
  },
  methods: {
    setTableCellClass ({ row, column, rowIndex, columnIndex }) {
      // console.log(row, column, rowIndex, columnIndex)
      if (column.property === 'view') {
        return 'ditInfo'
        // return 'color:#fff'
      } else {
        return ''
      }
    },
    selectType (val) {
      console.log(val)
      this.typeName = val

      if (this.aTypeTags.length === 1) {
        this.aTypeTags.push(val)
      } else {
        this.aTypeTags.pop()
        this.aTypeTags.push(val)
      }
    },
    handleClose (idx) {
      this.aTypeTags.splice(idx, 1)
      // this.typeName = ''
    },
    addLearnQus () {
      this.$refs.addIssueForm.openDialog(false)
    },
    submitForm (data) {
      console.log(data)
      let { title, knowledgePoint } = data
      this.tableData.push({
        title: title,
        knowledgePoint: knowledgePoint[0],
        descript: '家'
      })
    },
    // 表格方法
    rowClick (row) {
      console.log(`点击行${row}`, row)
      this.getIndex = row.index

      // this.$emit('openDetails', row)

      // 跳转详情
      this.$router.push({
        name: 'DetailsAnswer',
        query: row
      })
    },
    resetDateFilter () {
      this.$refs.filterTable.clearFilter('date')
    },
    clearFilter () {
      this.$refs.filterTable.clearFilter()
    },
    formatter (row, column) {
      return row.knowledgePoint
    },
    filterTag (value, row) {
      console.log('filterTag')
      return row.tag === value
    },
    filterHandler (value, row, column) {
      console.log('filterHandler')

      const property = column['property']
      return row[property] === value
    }
  }
}
</script>

<style lang="scss">
/* 添加表格hover样式 */
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #e9eef3 !important;
  /* text-decoration: underline; */
  cursor: pointer;

  &.ditInfo {
    // color: #606266 !important;
    color: inherit !important;
  }
}

#learnDir .ditInfo {
  color: #fff;
}

#learnDir .ditInfo:hover {
  background: blue;
}
</style>
<style lang="scss" scoped>
.el-table-filter__bottom {
  text-align: center;
}

.typeTags {
  margin: 0 2px;
}
</style>
