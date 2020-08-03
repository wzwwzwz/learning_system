
<template>
  <div id="queIndex" class="component_wrap">
    <el-row class="div_wrap">
      <el-col class="queIndexMenu">
        <el-tabs :tab-position="tabPosition" style="height: 100%;" v-model="tabsIndex" @tab-click="switchTab()"
          :before-leave="beforeSwitch">
          <template v-for="(item_tabs,idx_tabs) in aTabs">
            <el-tab-pane :key="idx_tabs" :label="item_tabs.val" :name="item_tabs.key">
            </el-tab-pane>
          </template>
        </el-tabs>
      </el-col>

      <el-col class="queIndexForm">
        <!-- 动态挂载 -->
        <QueForm ref="queForm" :initData="{type:tabsIndex}"></QueForm>
      </el-col>
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
        key: '0', val: '判断题'
      }]
    }
  },
  filters: {

  },
  created () {

  },
  mounted () {
    this.$refs.queForm.switchForm(Number(this.tabsIndex))
  },
  methods: {
    switchTab () { },
    beforeSwitch (newVal, oldVal) {
      // console.log(newVal, oldVal)
      this.$refs.queForm.switchForm(Number(newVal))
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
  }

  $MenuWidth: 100px;
  .queIndexMenu {
    width: $MenuWidth;
    height: 100%;
  }

  .queIndexForm {
    width: calc(100% - #{$MenuWidth});
    // width: $MenuWidth;
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
