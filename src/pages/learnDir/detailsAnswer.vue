<template>
  <div id="DetailsAnswer" class=''>
    <!-- 论点数据 -->
    <el-page-header @back="goBack" :content="issueData.title" style="font-weight: 700;"></el-page-header>
    <div class="descript">{{issueData.descript}} </div>

    <!-- 所有回答 -->
    <!-- <el-input type="textarea" :rows="2" placeholder="写下你的回答" v-model="textarea"></el-input> -->

    <!-- 写答案提交按钮 -->
    <div class="editBtnGrp">
      <el-button plain size="small" :class="[showEditor?'el-icon-close':'el-icon-edit']" @click="showEditor = !showEditor">
        {{btnAnswerOrCancel}}
      </el-button>
      <el-button plain size="small" icon="el-icon-check" @click="submit()" v-show="showEditor">提交</el-button>
    </div>

    <!-- 编辑器折叠展开 -->
    <div>
      <el-collapse-transition>
        <div v-show="showEditor" class="editTest">
          <Editor v-model="article.content" :placeholderVal="'请写下你的答案'" :value="EditorVal" ref="Editor" />
        </div>
      </el-collapse-transition>
    </div>

    <!-- 编辑器显示的内容 -->
    <div class="ql-container ql-snow">
      <!-- <div class="ql-editor" v-html="answerTest" ref="showEdit"></div> -->
    </div>

    <div class="answer_list_div" v-loading.lock="loading" :element-loading-text="'正在获取回答'">
      <div class="show_answers">{{answerList.length === 0 ? "暂无回答" : `全部回答(${answerList.length})`}}</div>
      <zReplyList :answerList="answerList" :componentLevel="0" @delete="deleteAnswer($event)" :issueData="issueData"></zReplyList>
    </div>

  </div>
</template>

<script>
import Editor from '@/components/common/Editor'
import zReplyList from '@/pages/learnDir/ReplyList'

import { getSystemTime } from '@/utils/index'
import { mapGetters } from 'vuex'

import * as check from '@/utils/validate'

// 测试代码
// import TestData from '@/utils/testFiles/testData'
// import testIssue from '@/utils/testFiles/testIssue'

export default {
  name: 'answerList',
  components: { Editor, zReplyList },
  props: {
    AnswerDate: {
      type: Object,
      default: () => { return {} }
    },
    idx: {
      type: Number,
      default: () => { return null }
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    btnAnswerOrCancel () {
      if (this.showEditor) {
        return '取消'
      } else {
        return '我要回答'
      }
    },
    updateTitle () {
      return this.qusTitle
    },
    updateAnswerStyle () {
      if (this.answerList.length === 0) {
        return { height: '770px' }
      }

      return { height: 'auto' }
    }
  },
  watch: {
  },
  data () {
    return {
      EditorVal: '',
      qusTitle: '',
      // 多文本编辑器内容
      article: {
        content: null
      },
      answerTest: '',
      showEditor: false,
      answerList: [
        // {
        //   userId: '253',
        //   userName: '小V',
        //   strhtml: '<div>热破解九年</div>',
        //   time: '2020-1-1',
        //   likes: 0,
        //   commenters: 5
        // }
      ],
      loading: false,
      // 跳转时请求的论点数据
      issueData: {}
    }
  },
  filters: {
  },
  created () {
    // 获取链接参数
    let key = this.$route.query.key
    // console.log(this.$route.query)
    if (key) {
      let vm = this
      vm.loading = true

      vm.issueData = this.$route.query
      vm.getAllAnswer(key)
    }
  },
  mounted () { },
  methods: {
    goBack () {
      this.$router.go(-1)
      this.qusTitle = 'ss'
      this.$emit('goBack')
    },
    submit () {
      let strHtml = this.article.content

      if (strHtml === null) {
        return this.$message.error('写点啥吧')
      }

      // 剔出<html>的标签
      let str = strHtml.replace(/<[^<>]+>/g, '')

      if (str.trim() === '') {
        return this.$message.error('不能为空')
      }

      // 提交
      this.answerTest = strHtml
      this.showEditor = false

      let objData = new this.$dataProcess.Parameter()
      objData.setFunc('rep_issue')

      let id = `submitAnswer_${new Date().getTime()}`
      let data = {
        id,
        key: '',
        issuekey: this.issueData.key,
        descript: strHtml
      }
      objData.setParams(data)

      this.$request('/repIssue', { data: objData.getJson() }).then((res) => {
      }).catch(() => {
      })

      // 假数据
      let virData = {
        id: 2255,
        userId: this.getUserInfo.userId,
        userName: 'jimim',
        time: getSystemTime(),
        strhtml: strHtml,
        showMore: true,
        likes: 2,
        commenters: 0
      }
      // 成功回调执行
      this.answerList.push(virData)
      this.EditorVal = ''
      this.$refs.Editor.clearContent()
    },
    /**
     * @description 获取所有回答
     * @param { String } key 论点的key
    **/
    getAllAnswer (key) {
      this.loading = true
      this.answerList = []

      let objData = new this.$dataProcess.Parameter()
      objData.setFunc('get_issue_rep')

      let data = {
        issuekey: key,
        selection: '1-20'
      }
      objData.setParams(data)

      let vm = this
      this.$request('/getIssueRep', { data: objData.getJson() }).then((res) => {
        let objDataRes = new vm.$dataProcess.Parameter()
        objDataRes.setJson(res)

        vm.answerList = []
        vm.answerList = vm.formatRspData(objDataRes.getParams())
        this.loading = false
      }).catch((error) => {
        console.log('error', error)
      })
    },
    deleteAnswer (param) {
      this.getAllAnswer()
    },
    // 将请求数据转化为ui使用的数据格式
    formatRspData (arr = []) {
      if (!check.isArray(arr)) {
        return false
      }
      let objFormat = new this.$dataProcess.FormatOption()
      objFormat.setItemMode(false)

      return arr.map((item, idx) => {
        let user = objFormat.toArr(item.user)
        return {
          id: item.key,
          userId: user[0],
          userName: user[1],
          time: item.time,
          strhtml: item.descript,
          showMore: true,
          likes: item.agree,
          commenters: item.disagree
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.editTest {
  // height: 500px;
}

.submitBtn {
  float: right;
  margin-top: 10px;
}

.ql-container.ql-snow {
  border: 1px solid #ccc;
  border: none;
}

.descript {
  padding: 10px 0;
}

.editBtnGrp {
  margin-top: 10px;
}

// 评论显示
.answer_list_div {
  margin-top: 10px;
  .show_answers {
    font-weight: 700;
  }
}
</style>
