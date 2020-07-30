<template>
  <div id='examItem' class=''>
    <div :class="queTitleClass" class="title" style="">{{quetypeTitle}}</div>
    <template v-for="(item,idx) in qusList" class="text item">
      <el-card :key="idx" class="box-card" :id="`${idPrefix}_${idx+1}`">

        <div slot="header" class="clearfix">
          <span>第{{idx+1}}题</span>
          <span style="margin-left:10px">{{item.title ? item.title : ""}}</span>
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
    quetypeTitle: {
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
@mixin answer_bg($bg) {
  background-color: $bg !important;
  color: white !important;
  opacity: 0.8;
}

.wrapper {
  background: inherit;
  padding: 10px 0;
}

.notes_wrap {
  background: #fff;
}
.exam_notes {
  width: 500px;
  margin: 50px auto;
  text-align: center;

  h3 {
    text-align: center;
  }

  .notes {
    text-align: left;
    margin: 20px 0;
  }

  .btnStart {
    text-align: center;
  }
}

.exam_qus {
  $sheet-width: 300px;
  .qus,
  .sheet {
    display: inline-block;
    height: 100%;
  }

  .title {
    padding: 10px;
    font-weight: 700;
  }

  .error_answer_bg {
    @include answer_bg(#f44336);
    &span {
      color: darkgreen !important;
    }
  }

  .correct_answer_bg {
    @include answer_bg(#4caf50);
    & .el-radio__input.is-disabled + span.el-radio__label {
      color: darkgreen !important;
    }
  }

  .qus {
    width: calc(100% - 10px - #{$sheet-width});
    margin-right: 10px;
    float: left;
    margin-bottom: 40%;

    .text {
      font-size: 14px;
    }

    .item {
      margin-bottom: 18px;
    }

    .title {
      background-color: #409eff;
      color: #fff;
      text-align: center;
    }

    .correct_answer {
      color: darkgreen;
      padding: 8px 20px;
      font-weight: 700;
    }
  }

  .sheet {
    width: 29%;
    width: $sheet-width;
    position: fixed;
    background: #fff;
    // padding: 0 10px;

    & > .title {
      font-size: 20px;
      color: brown;
      border-bottom: 1px solid;

      span {
        // color: cadetblue;
        display: inline-block;
        width: 49%;
        text-align: center;
      }
    }

    .block {
      padding: 0 10px;
      margin-top: 10px;
    }

    .time {
      border-left: 1px solid;
    }

    .btn_sheet {
      width: 40px;
      height: 40px;
      padding: 0;
      margin-top: 10px;

      &:hover {
        a {
          color: #fff;
        }
      }

      span {
        text-align: center;
      }

      a {
        color: inherit;
      }
    }

    .top {
      margin-bottom: 10px;
    }

    .answered {
      color: #000;
      button {
        background: #409eff;
        color: #eee;
      }
    }

    .submit {
      width: 100%;
      margin-top: 30px;
    }

    .score {
      color: inherit;
      margin-top: 60px;
      padding: 10px;
    }
  }
}

// 覆盖单选按钮组样式
.el-radio-group {
  width: 100%;
}

.el-radio {
  width: 100%;
  margin: 0;
  padding: 10px;

  &:hover {
    background: #eee;
  }
}
</style>

<style lang="scss">
// 选项组按钮禁用样式
#exam {
  .el-radio__input.is-disabled + span.el-radio__label {
    color: inherit;
  }
  // .el-radio__input.is-checked + .el-radio__label {
  // }
}
</style>
