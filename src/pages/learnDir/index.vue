<template>
  <!-- <router-view></router-view> -->
  <div id="learnDirIndex" class="component_wrap container">

    <!--用is特性动态的选择要挂载的组件-->
    <!-- <component :is="currentView" @openDetails="openDetails($event)" @goBack="returnDefault" :AnswerDate="paramsDate" :idx="curIdx">
    </component> -->

    <router-view></router-view>
  </div>
</template>

<script>
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
    }
  }
}
</script>
<style lang='scss' scoped>
#learnDirIndex {
  height: auto;
}
</style>
