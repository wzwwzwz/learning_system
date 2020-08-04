<template>
  <div class=''>
    <el-page-header @back="goBack" :content="qusTitle"></el-page-header>

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

    <div class="answer_list_div">
      <div class="show_answers">{{answerList.length === 0 ? "暂无回答" : `全部回答(${answerList.length})`}}</div>
      <zReplyList :answerList="answerList" :componentLevel="0" @delete="deleteAnswer($event)"></zReplyList>
    </div>

  </div>
</template>

<script>
import Editor from '@/components/common/Editor'
import zReplyList from '@/pages/learnDir/ReplyList'

import { getSystemTime } from '@/utils/index'
import { mapGetters } from 'vuex'

// 测试代码
import TestData from '@/utils/testFiles/testData'
import testIssue from '@/utils/testFiles/testIssue'

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
    }
  },
  watch: {
  },
  data () {
    return {
      // 测试函数
      TestDateFun: new TestData(),
      EditorVal: '',
      qusTitle: '',
      article: {
        content: null
      },
      answerTest: '',
      showEditor: false,
      oShowMoreVal: {
        true: '显示全部',
        false: '收起'
      },
      answerList: [
        // {
        //   userId: '253',
        //   userName: '小V',
        //   strhtml: '<div>热破解九年</div>',
        //   time: '2020-1-1',
        //   likes: 0,
        //   commenters: 5
        // }
      ]
    }
  },
  filters: {
  },
  created () {
    // 测试数据
    let data1 = {
      id: 123,
      userId: 111,
      userName: '甜酒果',
      time: '2020-1-1',
      likes: 2,
      commenters: 2,
      showMore: true,
      strhtml: '<p>LED排列成矩阵或笔段，预制成标准大小的模块。室内显示屏常用的有8*8象素模块、8字7段数码预制成标准大小的模块。预制成标准大小的模块。预制成标准大小的模块。预制成标准大小的模块。模块。</p><p><strong>LED排列成矩阵或笔段，预制成标准大小的模块。LED排列成矩阵或笔段，预制成标准大小的模块。</strong></p><p>户外显示屏象素模块有4*4、8*8、8*16象素等规格。户外显示屏用的象素模块因为其每一象素由两只以上LED管束组成，故又称其为集管束模块。</p>LED排列成矩阵或笔段，预制成标准大小的模块。室内显示屏常用的有8*8象素模块、8字7段数码fffffffff模块<p>户外显示屏象素模块有4*4、8*8、8*16象素等规格。户外显示屏用的象素模块因为其每一象素由两只以上LED管束组成，故又称其为集管束模块。故又称其为集管束模块故又称其为集管束模块故又称其为集管束模块故又称其为集管束模块故又称其为集管束模块故又称其为集管束模块</p><p>LED排列成矩阵或笔段</p><p>LED排列成矩阵或笔段</p><p>LED排列成矩阵或笔段</p><p>LED排列成矩阵或笔段</p><p>LED排列成矩阵或笔段</p><p>LED排列成矩阵或笔段</p><p>LED排列成矩阵或笔段</p><p>LED排列成矩阵或笔段</p><p>LED排列成矩阵或笔段</p><p>LED排列成矩阵或笔段</p><p>LED排列成矩阵或笔段</p>'
    }

    this.TestDateFun.add(data1)

    let data2 = {
      id: 456,
      userId: '253',
      userName: '小V',
      strhtml: '<div>正常情况下，室内LED显示屏的亮度和室外LED显示屏的亮度是不同的，一般情况下，室内LED显示屏的光强在500μcd-50mcd，室外LED显示屏的光强在100mcd-1000mcd，甚至在1000mcd以上。</div><p>关于getters如何使用,可以看一下上面代码的注释,这里我重点介绍一下getters和computed的不同,就是上面的第三种用法,我之前在vue进阶系列中探讨过computed，filters两种数据处理工具的局限性,有兴趣的可以去看这篇文章,computed的一个缺点就是不能传参,假设你要去判断一个数组里是否存在某个值,那你没法将某个值传到computed中去,这其实是一个很蛋疼的事情,当然你可以通过某些特殊手段,这里我不展开,有兴趣的可以留言.<p>',
      time: '2020-1-1',
      likes: 0,
      commenters: 0
    }

    this.TestDateFun.add(data2)

    let data3 = {
      id: '1-3',
      userId: 111,
      userName: '小V',
      strhtml: '<div>正常情况下，室内LED显示屏的亮度和室外LED显示屏的亮度是不同的，一般情况下，室内LED显示屏的光强在500μcd-50mcd，室外LED显示屏的光强在100mcd-1000mcd，甚至在1000mcd以上。</div><p>关于getters如何使用,可以看一下上面代码的注释,这里我重点介绍一下getters和computed的不同,就是上面的第三种用法,我之前在vue进阶系列中探讨过computed，filters两种数据处理工具的局限性,有兴趣的可以去看这篇文章,computed的一个缺点就是不能传参,假设你要去判断一个数组里是否存在某个值,那你没法将某个值传到computed中去,这其实是一个很蛋疼的事情,当然你可以通过某些特殊手段,这里我不展开,有兴趣的可以留言.<p>',
      time: '2020-1-1',
      likes: 0,
      commenters: 0
    }

    this.TestDateFun.add(data3)
    // 测试数据结束

    // 获取链接参数
    let key = this.$route.query.key
    console.log(this.$route.query)
    if (key) {
      let vm = this

      let obj = {
        param: { key },
        success: function (res) {
          let issueData = res
          console.log(issueData)
          // issueData.name =
          vm.getAllAnswer(key)
        },
        fail: function (error) {
          console.log(error)
        }
      }
      // 获取论点信息
      this.$emit('getIssue', obj)
    }
  },
  mounted () { },
  methods: {
    goBack () {
      //   console.log('go back')
      this.$router.go(-1)
      this.qusTitle = 'ss'
      this.$emit('goBack')
    },
    submit () {
      // console.log(this.article.content)

      if (this.article.content !== null) {
        // let contentVal = this.article.content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
        // console.log(this.article.content, '----------', contentVal)
        this.answerTest = this.article.content
        this.showEditor = false

        let data = {
          id: 2255,
          userId: this.getUserInfo.userId,
          userName: 'jimim',
          time: getSystemTime(),
          strhtml: this.article.content,
          showMore: true,
          likes: 2,
          commenters: 0
        }

        this.answerList.push(data)
        this.EditorVal = ''
        this.$refs.Editor.clearContent()

        // console.log(this.$refs.showEdit.innerText)
      }
    },
    /**
     * @description 获取所有回答
     * @param { String } key 论点的key
    **/
    getAllAnswer (key) {
      this.answerList = []
      this.answerList = this.TestDateFun.getData()

      let objData = new this.$dataProcess.Parameter()
      objData.setFunc('get_issue_rep')

      let data = {
        issuekey: key,
        selection: '1-20'
      }
      objData.setParams(data)

      this.$request('/getIssueRep', { data: objData.getJson() }).then((res) => {
        console.log('ok', res)
        console.log(testIssue)
      }).catch((error) => {
        console.log('error', error)
      })
    },
    deleteAnswer (param) {
      this.TestDateFun.delete(param.id)
      this.getAllAnswer()
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

.editBtnGrp {
  margin-top: 20px;
}

// 评论显示
.answer_list_div {
  margin-top: 10px;
  .show_answers {
    font-weight: 700;
  }
}
</style>
