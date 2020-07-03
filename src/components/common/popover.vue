<template>
  <div class='zPopover'>
    <el-popover placement="top" width="160" v-model="visible">
      <p>{{title}}</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="handleCancel()">取消</el-button>
        <el-button type="primary" size="mini" @click="handleOk()">确定</el-button>
      </div>
      <!-- <el-button slot="reference">删除</el-button> -->
      <slot :name="slotName" slot="reference"></slot>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'popover',
  props: {
    slotName: {
      type: String,
      default: () => 'btn'
    },
    title: {
      type: String,
      default: () => '你确定吗？'
    }
  },
  components: {
  },
  computed: {},
  data () {
    return {
      visible: false
    }
  },
  created () {
    console.log(this.slotName)
  },
  mounted () { },
  methods: {
    handleCancel () {
      this.visible = false
      this.$emit('cancel')
    },
    handleOk () {
      this.visible = false
      this.$emit('ok')
    }
  }
}
</script>
<style lang='scss' scoped>
.zPopover {
  display: inline-block;
}
</style>
