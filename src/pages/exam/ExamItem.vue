<template>
  <div id='examItem' class=''>
    <div :class="queTitleClass" class="title" style="">{{queTypeTitle}}</div>
    <template v-for="(item,idx) in qusList" class="text item">
      <el-card :key="idx" class="box-card" :id="`${idPrefix}_${idx+1}`">

        <div slot="header" class="clearfix">
          <span>第{{idx+1}}题<strong> .</strong></span>
          <span style="">{{item.title ? item.title : ""}}</span>
          <!-- <el-button style=" float: right; padding: 3px 0" type="text">{{item.qusLevel}}</el-button> -->
        </div>

        <!-- 选项 -->
        <template>
          <slot name="options" :item="item" :idx="idx"></slot>
        </template>

      </el-card>
    </template>
  </div>
</template>

<script>
export default {
  name: 'examItem',
  components: {},
  computed: {},
  props: {
    queTypeTitle: {
      type: String,
      default: ''
    },
    qusList: {
      type: Array,
      default: () => []
    },
    idPrefix: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 题目样式
      queTitleClass: 'el-card box-card is-always-shadow'

    }
  },
  created () { },
  mounted () { },
  methods: {}
}
</script>
<style lang='scss' scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.title {
  padding: 10px;
  font-weight: 700;
  background-color: #409eff;
  color: #fff;
  text-align: center;
}
</style>
