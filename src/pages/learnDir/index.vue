<template>
  <!-- <router-view></router-view> -->
  <div id="learnDirIndex" class="component_wrap container">
    <!-- <button @click="change">切换页面</button> -->
    <!--用is特性动态的选择要挂载的组件-->
    <component :is="currentView" @openDetails="openDetails($event)" @goBack="returnDefault" :AnswerDate="paramsDate" :idx="curIdx">
    </component>
  </div>
</template>

<script>
// 导入的命名 === 组件的name属性
import learnDir from '@/pages/learnDir/learnDir'
import detailsAnswer from '@/pages/learnDir/detailsAnswer'

export default {
  name: '',
  components: {
    learnDir,
    detailsAnswer
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
        name: 'learnDir'
      }, {
        name: 'detailsAnswer'
      }],
      paramsDate: ''
    }
  },
  created () { },
  mounted () { },
  methods: {
    change: function () {
      this.curIdx = (++this.curIdx) % this.arrComponent.length
    },
    openDetails (data) {
      //   debugger
      this.curIdx = (++this.curIdx) % this.arrComponent.length
      //   this.curIdx =
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
