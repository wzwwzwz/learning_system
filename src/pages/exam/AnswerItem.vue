<template>
  <!-- AnswerSheetItem -->
  <div id='answerItem' class=''>
    <div class="title">
      <span>{{queTypeTitle}}(共{{list.length}}题)</span>
    </div>
    <div class="g_spilt_div_Horizontal"></div>
    <div>
      <template v-for="(item,idx) in list">
        <!-- {{item}} -->
        <a :key="idx" :href="`#${idPrefix}_${idx+1}`" :class="{ answered:selectedClass(item) }">

          <el-button :key="idx" type="primary" plain style="margin-left: 10px;" class="btn_sheet">
            {{idx+1}}-{{  item | formatVal }}
          </el-button>

        </a>
      </template>
    </div>
  </div>
</template>

<script>
import * as check from '@/utils/validate'

export default {
  name: 'answerItem',
  components: {},
  props: {
    queTypeTitle: {
      type: String,
      default: ''
    },
    answerList: {
      type: Array,
      default: () => []
    },
    idPrefix: {
      type: String,
      default: ''
    },
    // 是否为多维数组(绑定的answerList)
    bMultiArr: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    answerList: {
      handler (newVal, oldVal) {
        // console.log('子组件新值', newVal)
        this.list = newVal
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    selectedClass () {
      return function (val) {
        // console.log(typeof val, val)

        if (val === '') {
          return false
        }

        // 多维数组
        if (check.isArray(val) && val.length === 0) {
          return false
        }

        return true
      }
    }
  },
  filters: {
    // 格式化选中的值.将绑定值为字符串的转化为字母ABC。将绑定值格式为二维数组(对选)的转化为字母
    formatVal (val) {
      // 单选题
      if (check.isNumber(val) && val !== undefined) {
        return String.fromCharCode(65 + val)
      }

      // 判断题
      if (check.isBoolean(val)) {
        switch (val) {
          case true:
            return 'T'
          case false:
            return 'F'
          default:
            return ''
        }
      }

      // 多选题
      if (check.isArray(val)) {
        if (val.length === 0) {
          return ''
        }

        // 多维数组
        return val.map((i) => {
          return String.fromCharCode(65 + i)
        }).toString()
      }

      return val
    }

  },
  data () {
    return {
      list: []
    }
  },
  created () { },
  mounted () { },
  methods: {
    // 选中样式
    // selectedClass (val) {
    //   if (check.isString(val) && val !== undefined) {
    //     if (val.length !== 0) {
    //       return true
    //     }
    //   }
    //   // 多维数组
    //   if (check.isArray(val) && val.length !== 0) {
    //     return true
    //   }

    //   return false
    // }
  }
}
</script>
<style lang='scss' scoped>
#answerItem {
  .title {
    padding: 10px;
    font-weight: 700;
  }

  .btn_sheet {
    min-width: 40px;
    height: 40px;
    padding: 0 5px;
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

  .answered {
    color: #000;
    button {
      background: #409eff;
      color: #eee;
    }
  }
}
</style>
