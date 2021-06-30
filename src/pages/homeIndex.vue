<template>
  <div class=''>
    <el-button type="primary" @click="click('ruleForm')">点击</el-button>
    <el-button type="primary" @click="ok()">确定</el-button>

    <el-radio-group v-model="answerSheetSel">
      <el-radio :label="item_op.key" v-for="(item_op,index_op) in selectOptions" :key="index_op">
        {{`${item_op.key}`}}.{{item_op.value}}
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script>

export default {
  name: '',
  components: {},
  computed: {
  },
  data () {
    return {
      selectOptions: [],
      answerSheetSel: ''
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    click () {
      // let option = '我们觉得<br/>就是<br/>选项三'
      let str = '6,4,1'
      let objFormat = new this.$dataProcess.FormatOption()
      objFormat.setSeparator(',')
      objFormat.setItemKeyValue('', '')
      objFormat.setItemMode(false)

      let arr = objFormat.toArr(str)
      this.selectOptions = arr
      console.log(arr)
    },
    ok () {
      console.log(this.answerSheetSel)
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
