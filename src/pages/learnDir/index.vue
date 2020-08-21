<template>
  <div id="learnDirIndex" class="component_wrap container">

    <!--用is特性动态的选择要挂载的组件-->
    <!-- <component :is="currentView" @openDetails="openDetails($event)" @goBack="returnDefault" :AnswerDate="paramsDate" :idx="curIdx">
    </component> -->

    <router-view @getIssue="getIssueMerge($event)"></router-view>
  </div>
</template>

<script>
import * as check from '@/utils/validate'

// 导入的命名 === 组件的name属性
import Issue from '@/pages/learnDir/Issue'
import DetailsAnswer from '@/pages/learnDir/DetailsAnswer'

export default {
  name: '',
  components: {
    Issue,
    DetailsAnswer
  },
  computed: {
    currentView () {
      return this.arrComponent[this.curIdx].name
    }
  },
  data () {
    return {
      curIdx: 0,
      // 组件组合
      arrComponent: [{
        name: 'Issue'
      }, {
        name: 'DetailsAnswer'
      }],
      paramsDate: ''
    }
  },
  created () { },
  mounted () { },
  methods: {
    openDetails (data) {
      this.curIdx = (++this.curIdx) % this.arrComponent.length
      this.paramsDate = data
    },
    returnDefault () {
      this.curIdx = 0
    },
    /**
     * @description 获取论点
     * @param { String } obj 对象包含 params发送请求的数据对象(只是param内的参数并非整个请求传参对象),success成功回调，fail失败回调
    **/
    getIssueMerge ({ param = {}, success = () => { }, fail = () => { } }) {
      if (!check.isObject(param)) {
        return false
      }

      let objData = new this.$dataProcess.Parameter()
      objData.setFunc('get_issue')

      if (JSON.stringify(param) !== '{}') {
        objData.setParams(param)
      }

      this.$request('/getIssue', { data: objData.getJson() }).then((res) => {
        return success(res)
      }).catch((error) => {
        return fail(error)
      }).finally(() => {

      })
    }
  }
}
</script>
<style lang='scss' scoped>
#learnDirIndex {
  height: auto;
  min-height: 870px;
}
</style>
