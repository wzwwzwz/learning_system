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

      <!-- <el-button type="primary" icon="el-icon-edit" @click="editExam()">出题</el-button> -->
      <el-button type="text" icon="el-icon-edit" @click="addLearnQus()" style="float: right;">添加一条</el-button>
      <!-- 出题表单弹框 -->
      <examQueDialog ref="examQueForm" :knowledgeOptions="oBtnGrpInfo.aBtn" @submitForm="submitForm($event)"
        :dialogTiltle="examQueData.title">
      </examQueDialog>

      <!-- list -->
      <template>
        <!-- <el-button @click="resetDateFilter">清除日期过滤器</el-button>
        <el-button @click="clearFilter">清除所有过滤器</el-button> -->

        <el-table ref="filterTable" :data="tableData" style="width: 100%" @row-click="rowClick" :cell-class-name="setTableCellClass">
          <el-table-column type="index" label="序号" width="50" align="left"></el-table-column>
          <el-table-column prop="name" label="题目" width="500">
          </el-table-column>
          <el-table-column prop="address" label="知识点">
          </el-table-column>
          <el-table-column class="ditInfo" width="80">查看回答</el-table-column>
          <!-- <el-table-column prop="tag" label="标签" width="100" :filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]"
            :filter-method="filterTag" filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag :type="scope.row.tag === '家' ? 'primary' : 'success'" disable-transitions>{{scope.row.tag}}</el-tag>
            </template>
          </el-table-column> -->
        </el-table>
      </template>

    </div>

  </div>
</template>

<script>
import btnGrp from '@/components/common/btnGrp.vue'
import examQueDialog from '@/components/common/examQueDialog.vue'

export default {
  name: '',
  components: {
    btnGrp,
    examQueDialog
  },
  computed: {
    updateType () {
      console.log()
      // return item
      if (this.examQueForm.bIsSelectQue) {
        return [{ key: true }, { key: false }]
      } else {
        return this.examQueForm.selectOptions
      }
    }
  },
  data () {
    return {
      typeName: '',
      aTypeTags: ['全部'],
      // 出题组件数据
      examQueData: {
        showDialog: false,
        title: '添加学习纲目'
      },
      oBtnGrpInfo: {
        titleName: '知识点分类',
        aBtn: [{
          name: '业内名词',
          label: '业内名词'
        }, {
          name: '公司内部名词',
          label: '公司内部名词'
        }, {
          name: '行业产品',
          label: '行业产品'
        }, {
          name: '公司产品',
          label: '公司产品'
        }, {
          name: '产品应用场景',
          label: '产品应用场景'
        }, {
          name: '产品目的',
          label: '产品目的'
        }]
      },
      tableData: [{
        date: '2016-05-02',
        name: '有什么奇怪的知识点',
        address: '业内名词',
        tag: '家'
      }, {
        date: '2016-05-04',
        name: '今天你吃了吗？',
        address: '行业产品',
        tag: '公司'
      }, {
        date: '2016-05-01',
        name: '世界论',
        address: '产品应用场景',
        tag: '家'
      }, {
        date: '2016-05-03',
        name: '黑洞讨论',
        address: '产品目的',
        tag: '公司'
      }]
    }
  },
  methods: {
    setTableCellClass ({ row, column, rowIndex, columnIndex }) {
      // console.log(row, column, rowIndex, columnIndex)
      if (columnIndex === 3) {
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
      this.examQueData.title = '添加学习纲目'
      this.$refs.examQueForm.openDialog(false)
    },
    editExam () {
      this.examQueData.title = ''
      this.$refs.examQueForm.openDialog(true)
    },
    submitForm (data) {
      console.log(data)
      let { title, knowledgePoint } = data
      this.tableData.push({
        date: '2016-05-02',
        name: title,
        address: knowledgePoint[0],
        tag: '家'
      })
    },
    // 表格方法
    rowClick (row) {
      console.log(`点击行${row}`, row)
      this.getIndex = row.index

      // 跳转详情
      // this.$router
      // this.$router.push({ name: 'detailsAnswer', params: { data: row } })

      this.$emit('openDetails', row)
    },
    resetDateFilter () {
      this.$refs.filterTable.clearFilter('date')
    },
    clearFilter () {
      this.$refs.filterTable.clearFilter()
    },
    formatter (row, column) {
      return row.address
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
