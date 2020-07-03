<template>
  <div class=''>
    <el-page-header @back="goBack" :content="AnswerDate.name"></el-page-header>

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

    <!-- 所有回答 -->
    <!-- <el-card class="box-card">
      <div v-for="o in 4" :key="o" class="text item">
        {{'列表内容 ' + o }}
      </div>
    </el-card> -->

    <div class="answer_list_div">
      <div class="show_answers">{{answerList.length === 0 ? "暂无回答" : `全部回答(${answerList.length})`}}</div>
      <template v-for="(item,index) in answerList">
        <div :key="index" class="answer_list_wrap">
          <div class="answer_list_top">
            <el-avatar shape="square" icon="el-icon-user-solid" class="btn_user_icon"></el-avatar>
            <span class="small_tag_wrap">
              <span class="small_tag User">{{item.userName}}</span>
              <span class="small_tag Time">{{item.time}}</span>
            </span>
          </div>
          <!-- text.substring(0, 200) -->
          <!-- <div v-bind:class="{ expansion : active }" class="card-mid">{{message}}</div> -->
          <div class="ql-container ql-snow answer_list_main">
            <!-- <div class="ql-editor card-mid" v-bind:class="{ expansion : active }"
              v-html="item.strhtml.length > 200 ? item.strhtml.substring(0, 200):item.strhtml"></div> -->
            <!-- ------------------ 回答文本 ------------------ -->
            <div class="ql-editor card-mid show_answers_val"
              v-bind:class="{ unshadow : item.strhtml.length > 500 && !item.showMore || item.strhtml.length < 500 }"
              v-html="updateShowMoreCon(item.strhtml,0,item.showMore)">
            </div>
            <!-- v-show="item.showMore.length > 500" -->
            <!-- ------------------ 按钮：显示全部 || 收起 ------------------ -->
            <div v-show="item.strhtml.length > 500" :class="{show_answers_more:true,show_answers_less:!item.showMore}"
              @click="clickshowMore(item.strhtml,index)" ref="refShowMoreDiv">
              {{item.showMore | updateShowMorebtn}}
              <i :class="item.showMore ?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
            </div>
          </div>
          <!-- ------------------ 操作按钮 ------------------ -->
          <div class="answer_list_bottom dbclick_unchecked">
            <el-link type="primary" @click="likeOperation()"><i class="el-icon-thumb "></i>点赞 {{`(${item.likes})`}}</el-link>
            <el-link type="primary"><i class="el-icon-chat-dot-square "></i>回复 {{`(${item.commenters})`}}</el-link>
            <!-- <el-button type="text" plain icon="el-icon-chat-dot-square">回复</el-button> -->
            <el-link type="danger" @click="deleteAnswer(item)"
              v-show="getUserInfo.userId === item.userId || getUserInfo.userAuth === 'admin' || getUserInfo.userAuth === 'judge'">
              <i class="el-icon-delete"></i>删除
            </el-link>
          </div>
        </div>
      </template>
    </div>

  </div>
</template>

<script>
import Editor from '@/components/common/Editor'
import { getSystemTime } from '@/utils/index'
import { mapGetters } from 'vuex'
// 测试代码
import TestData from '@/utils/testFiles/testData'

export default {
  name: 'btnGrp',
  components: { Editor },
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
    updateShowMoreCon () {
      let vm = this
      return function (val, len, b) {
        // console.log('58941ddd')
        return vm.filtesShowMore(val, 500, b)
      }
    }

  },
  data () {
    return {
      // 测试函数
      TestDateFun: new TestData(),
      active: false,
      EditorVal: '',
      qusTitle: '',
      textarea: 'dddddd',
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
        // },
        // {
        //   userId: '254',
        //   userName: '甜酒果',
        //   strhtml: '<div>啊啊啊算法</div>',
        //   time: '2020-1-1',
        //   likes: 2,
        //   commenters: 0
        // },
        // {
        //   userId: 111,
        //   userName: '甜酒果',
        //   strhtml: '<div>啊啊啊算法</div>',
        //   time: '2020-1-1',
        //   likes: 2,
        //   commenters: 0
        // },
        // {
        //   userId: 111,
        //   userName: '甜酒果',
        //   time: '2020-1-1',
        //   likes: 2,
        //   commenters: 0,
        //   showMore: true,
        //   strhtml: '<p>中。”网民“orfila2011”在评论中表示；“陕西蓝天救援队”官方微博也表示，民间在地震预测工作中有价值的经验方法，有关部门应给予足够的重视。</p><p><strong>预报根据省地震局数据分析得出</strong></p><p>该民间地震ddddddddddddddddddd预报微博的资料显示，所在地位于湖北。“很久以前，该微博就已经在微博上播报地震预测信息，但一直很神秘。”有网友表示。昨日，记者通过微博联系上这一神秘民间地震预报机构。</p><p>该民间机构是怎样获得地震预报信息的？该微博博主向记者表示，他们是根据云南省地震局官网云南地震数据共享中心查询到了云南省内的一些地震监测数据，分析得出的预报信息。记者发现，确实可以通过该网站查到云南各地震监测点的预处理数据。</p><p>&gt;该微博博主还透露，分析这些相关数据需要很多专业知识，但并不需要仪器。对于民间机构预报地震的动力，该博主表示“物质和精神都有”。对于其他信息，该博主不愿意更多透露。</p><p><strong>省地震局：民间仅限于学术交流</strong></p><p>“地震预测预报必须遵守相应的法律法规。”省地震局科学技术处处长、新闻发言人张俊伟在接受记者采访时表示，根据我国法律，任何个人或民间机构对外发布地震预报信息都是违法行为。</p>'
        // }
      ]
    }
  },
  filters: {
    updateShowMorebtn (val) {
      // if()
      if (val) {
        return '显示全部'
      } else {
        return '收起'
      }
    }
  },
  created () {
    // 测试数据
    let data1 = {
      userId: 111,
      userName: '甜酒果',
      time: '2020-1-1',
      likes: 2,
      commenters: 0,
      showMore: true,
      strhtml: '<p>中。”网民“orfila2011”在评论中表示；“陕西蓝天救援队”官方微博也表示，民间在地震预测工作中有价值的经验方法，有关部门应给予足够的重视。</p><p><strong>预报根据省地震局数据分析得出</strong></p><p>该民间地震ddddddddddddddddddd预报微博的资料显示，所在地位于湖北。“很久以前，该微博就已经在微博上播报地震预测信息，但一直很神秘。”有网友表示。昨日，记者通过微博联系上这一神秘民间地震预报机构。</p><p>该民间机构是怎样获得地震预报信息的？该微博博主向记者表示，他们是根据云南省地震局官网云南地震数据共享中心查询到了云南省内的一些地震监测数据，分析得出的预报信息。记者发现，确实可以通过该网站查到云南各地震监测点的预处理数据。</p><p>&gt;该微博博主还透露，分析这些相关数据需要很多专业知识，但并不需要仪器。对于民间机构预报地震的动力，该博主表示“物质和精神都有”。对于其他信息，该博主不愿意更多透露。</p><p><strong>省地震局：民间仅限于学术交流</strong></p><p>“地震预测预报必须遵守相应的法律法规。”省地震局科学技术处处长、新闻发言人张俊伟在接受记者采访时表示，根据我国法律，任何个人或民间机构对外发布地震预报信息都是违法行为。</p>'
    }

    this.TestDateFun.add(data1)

    let data2 = {
      userId: '253',
      userName: '小V',
      strhtml: '<div>热破解九年</div><p>关于getters如何使用,可以看一下上面代码的注释,这里我重点介绍一下getters和computed的不同,就是上面的第三种用法,我之前在vue进阶系列中探讨过computed，filters两种数据处理工具的局限性,有兴趣的可以去看这篇文章,computed的一个缺点就是不能传参,假设你要去判断一个数组里是否存在某个值,那你没法将某个值传到computed中去,这其实是一个很蛋疼的事情,当然你可以通过某些特殊手段,这里我不展开,有兴趣的可以留言.<p>',
      time: '2020-1-1',
      likes: 0,
      commenters: 5
    }

    this.TestDateFun.add(data2)
    // 测试数据结束

    this.getAllAnswer()
  },
  mounted () { },
  methods: {
    goBack () {
      //   console.log('go back')
      //   this.$router.go(-1)
      this.qusTitle = 'ss'
      console.log(this.idx)

      this.$emit('goBack')

      //   console.log(this.$options.name)
    },
    submit () {
      // console.log(this.article.content)

      if (this.article.content !== null) {
        // let contentVal = this.article.content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
        // console.log(this.article.content, '----------', contentVal)
        this.answerTest = this.article.content
        this.showEditor = false

        let data = {
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
    clickshowMore (val, idx) {
      console.log(val)
      this.answerList[idx].showMore = !this.answerList[idx].showMore
    },
    likeOperation () {
      // http get请求
      this.axios.get('http://jsonplaceholder.typicode.com/users').then(
        data => {
          console.log(data)
          this.id_num = data.body
        }
      )
    },
    deleteAnswer (item) {
      // debugger
      // this.$store.getUserInfo()
      // this.answerList = []

      this.TestDateFun.delete(item.id)
      this.getAllAnswer()
    },
    // 获取所有回答
    getAllAnswer () {
      this.answerList = []
      this.answerList = this.TestDateFun.getData()
    },
    filtesShowMore (val, len, b) {
      // console.log(val)
      if (val.length < 500) {
        return val
      }
      if (b) {
        return val.substring(0, len)
      } else {
        return val
      }
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

.transition-box {
  margin-bottom: 10px;
  width: 200px;
  height: 100px;
  border-radius: 4px;
  background-color: #409eff;
  text-align: center;
  color: #fff;
  padding: 40px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}

.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  // width: 480px;
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
  .answer_list_wrap {
    padding: 18px 0;
    border-bottom: 1px solid #ddd;

    .answer_list_top {
      .small_tag_wrap {
        display: inline-block;
        position: relative;
        /* width: 100%; */
        /* height: 100%; */
        clear: both;
        height: 40px;
        margin-left: 7px;

        .small_tag {
          display: inline-block;
          position: absolute;
          width: max-content;
          height: max-content;
        }

        .Time {
          bottom: 2px;
          font-size: 12px;
        }
      }
    }

    .answer_list_main {
      position: relative;

      .expansion {
        white-space: pre-line;
        // width: 10.3rem;
        overflow: hidden;
        -webkit-line-clamp: 4;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
      }

      .show_answers_val {
        -webkit-mask-image: -webkit-gradient(
          linear,
          left top,
          left bottom,
          from(#1a1a1a),
          to(transparent)
        );
        -webkit-mask-image: linear-gradient(
          #1a1a1a calc(100% - 6rem),
          transparent calc(100% - 0.8rem)
        );
        mask-image: -webkit-gradient(
          linear,
          left top,
          left bottom,
          from(#1a1a1a),
          to(transparent)
        );
        mask-image: linear-gradient(
          #1a1a1a calc(100% - 8rem),
          transparent calc(100% - 2.8rem)
        );
        // -webkit-mask-size: 100% 100%;
        // mask-size: 100% 100%;
      }

      .unshadow {
        mask-image: none;
        -webkit-mask-image: none;
      }

      .show_answers_more {
        width: 100%;
        // height: 30px;
        // line-height: 30px;
        position: absolute;
        bottom: 0px;
        text-align: center;
        color: #777;
        font-weight: 700;

        &:hover {
          cursor: pointer;
        }
      }

      .show_answers_less {
        padding: 0 20px;
        bottom: auto;
        // text-align: right;
      }
    }

    .answer_list_bottom {
      a {
        margin: 0 6px;
      }
    }
  }
}
</style>
