<template>
  <div class='zPopover' :class="className">
    <el-popover placement="top" :width="width" v-model="visible" :popper-class="'popover_span'">
      <p>{{title}}</p>
      <div style="text-align: right; margin: 10px 0 0 ">
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
    },
    width: {
      // type: Number,
      default: () => 160
    },
    className: {
      type: String,
      default: () => ''
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
    // console.log(this.className)
  },
  mounted () { },
  methods: {
    setVisible (b) {
      this.visible = b
    },
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

  // &:not(:first-child) {
  //   margin-left: 15px;
  // }
}

p {
  font-weight: 700;
}
</style>
