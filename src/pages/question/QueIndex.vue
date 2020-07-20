
<template>
  <div id="queIndex" class="component_wrap">
    <el-row class="div_wrap">
      <el-col :span="1" style="width:100px;height:100%">
        <el-tabs :tab-position="tabPosition" style="height: 100%;" v-model="tabsIndex" @tab-click="switchTab()"
          :before-leave="beforeSwitch">
          <template v-for="(item_tabs,idx_tabs) in aTabs">
            <el-tab-pane :key="idx_tabs" :label="item_tabs.val" :name="item_tabs.key">
            </el-tab-pane>
          </template>
        </el-tabs>
      </el-col>

      <!-- 动态挂载 -->
      <QueForm ref="queForm" :auditType="tabsIndex"></QueForm>
    </el-row>

  </div>
</template>

<script>

import QueForm from './QueForm'
export default {
  name: 'myAudit',
  components: {
    QueForm
  },
  computed: {

  },
  data () {
    return {
      tabPosition: 'left',
      tabsIndex: '1',
      aTabs: [{
        key: '1', val: '选择题'
      },
      {
        key: '2', val: '判断题'
      }]
    }
  },
  filters: {

  },
  created () {
  },
  mounted () {

  },
  methods: {
    switchTab () {

    },
    beforeSwitch (newVal, oldVal) {
      console.log(newVal, oldVal)
      let val = false

      switch (this.tabsIndex) {
        case '1':
          val = false
          break
        case '2':
          val = true
          break
        default:
          break
      }

      this.$refs.queForm.switchForm(val)
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }

  }
}
</script>

<style lang='scss' scoped>
#queIndex {
  // padding: 50px 100px;

  .div_wrap {
    height: calc(100% - 40px);
    margin: 20px 136px;
  }
}
</style>

<style lang="scss">
#queIndex {
  .el-menu {
    height: 100%;
  }

  // 覆盖单选|多选按钮
  .el-radio,
  .el-checkbox {
    margin-right: 10px;
  }
}
</style>
