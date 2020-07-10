<template>
  <div id="replyaList">
    <template v-for="(item,index) in answerList">
      <div :key="index" class="answer_list_wrap">
        <div class="answer_list_top">
          <!-- ------------------ 头像 ------------------ -->
          <el-avatar shape="square" :size="componentLevel === 0 ? 'medium':'small'" icon="el-icon-user-solid" class="btn_user_icon">
          </el-avatar>
          <span class="small_tag_wrap">
            <span class="small_tag User">{{item.userName}}</span>
            <span class="small_tag Time">{{item.time}}</span>
          </span>
        </div>
        <div class="ql-container ql-snow answer_list_main">
          <!-- ------------------ 回答文本 ------------------ -->
          <div class="ql-editor card-mid show_answers_val"
            v-bind:class="{ unshadow : item.strhtml.length > 500 && !item.showMore || item.strhtml.length < 500 }"
            v-html="updateShowMoreCon(item.strhtml,0,item.showMore)">
          </div>

          <!-- ------------------ 按钮：显示全部 || 收起 ------------------ -->
          <div v-show="item.strhtml.length > 500" :class="{show_answers_more:true,show_answers_less:!item.showMore}"
            @click="clickshowMore(item.strhtml,index)" ref="refShowMoreDiv">
            {{item.showMore | updateShowMorebtn}}
            <i :class="item.showMore ?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
          </div>
        </div>

        <!-- ------------------ 操作按钮 ------------------ -->
        <div class="answer_list_bottom dbclick_unchecked">
          <div>
            <el-link type="primary" class="btn_Link" @click="likeOperation()"><i class="el-icon-thumb "></i>赞 {{`(${item.likes})`}}
            </el-link>
            <el-link type="primary" class="btn_Link" v-show="item.commenters !== 0" @click="viewComments(index)">
              <i class="el-icon-chat-dot-square"></i>{{componentLevel === 0 ? "查看评论":"查看回复"}} {{`(${item.commenters})`}}
            </el-link>
            <el-link type="primary" class="btn_Link btn_reply" @click="comment(`replyInput_level${componentLevel}_${index}`,index)">
              <i class="el-icon-reply "></i>{{componentLevel === 0 ? "评论":"回复"}}
            </el-link>
            <!-- <el-link type="danger" @click="deleteAnswer(item)"
              v-show="getUserInfo.userId === item.userId || getUserInfo.userAuth === 'admin' || getUserInfo.userAuth === 'judge'">
              <i class="el-icon-delete"></i>删除
            </el-link> -->

            <zPopover ref="popoverDelete" :title="componentLevel === 0 ? '你确定要删除这条回答吗？':'你确定要删除这条回复吗？'" :width="'auto'"
              @ok="deleteOk(item)">
              <el-link type="danger" class="btn_Link" slot="btn" @click="openPopover(index)" style="margin: 0 6px;"
                v-show="getUserInfo.userId === item.userId || getUserInfo.userAuth === 'admin' || getUserInfo.userAuth === 'judge'">
                <i class="el-icon-delete"></i>删除
              </el-link>
            </zPopover>

            <!-- 回复回答输入框 -->
            <template>
              <el-collapse-transition>
                <div v-show="listOperation[index].showReply" class="input_reply clearfix">
                  <el-input type="textarea" :rows="1" maxlength="300" show-word-limit class=""
                    :placeholder="componentLevel === 0 ? '请输入内容':`回复 ${item.userName}:`" v-model="listOperation[index].textareaReply"
                    :ref="`replyInput_level${componentLevel}_${index}`">
                  </el-input>
                  <el-button type="primary" plain size="mini" class="btn_reply_sunmit" :disabled="listOperation[index].textareaReply === ''"
                    @click="commitReply(item.id,listOperation[index].textareaReply)">
                    提交
                  </el-button>
                  <el-button plain size="mini" class="btn_reply_sunmit" style="margin-right:10px" @click="cancelReply(index)">
                    取消
                  </el-button>
                </div>
              </el-collapse-transition>
            </template>

            <!-- 查看所有回复 -->
            <div class="childrenList" :class="{hideChildrenList:listOperation[index].commentsList.length !== 0}"
              v-show="listOperation[index].commentsList.length !== 0 && componentLevel < 10">
              <replyList :answerList="listOperation[index].commentsList" :componentLevel="componentLevel + 1"
                @delete="deleteAnswer($event)"></replyList>
            </div>

          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script>
import zPopover from '@/components/common/popover'
import { mapGetters } from 'vuex'

// 测试代码
import TestData from '@/utils/testFiles/testData'

export default {
  name: 'replyList',
  components: { zPopover },
  props: {
    answerList: {
      type: Array,
      default: () => []
    },
    componentLevel: {

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
        return vm.filtesShowMore(val, 500, b)
      }
    }
  },
  watch: {
    answerList (val) {
      // console.log(val)
      let len = val.length
      this.listOperation = []
      let vm = this

      // this.$nextTick(() => {
      for (let idx = 0; idx < len; idx++) {
        vm.listOperation.push({
          textareaReply: '',
          showReply: false,
          commentsList: []
        })
      }
      // })
    }
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
      // 列表操纵
      listOperation: []
    }
  },
  filters: {
    updateShowMorebtn (val) {
      if (val) {
        return '显示全部'
      } else {
        return '收起'
      }
    }
  },
  created () {
    // console.log(this.answerList)
    this.updateOperateDate(this.answerList.length)
  },
  mounted () { },
  methods: {
    clickshowMore (val, idx) {
      // console.log(val)
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
    /**
    * @description 评论
    * @param { String } ref 绑定的输入框的ref值
    * @param { String } idx 循环遍历的下标
    **/
    comment (ref, idx) {
      this.listOperation[idx].showReply = true
      this.$nextTick(() => {
        this.$refs[ref][0].focus()
      })
    },
    viewComments (idx) {
      // console.log(idx)
      this.listOperation[idx].commentsList = [
        {
          id: '2_1',
          userId: 111,
          userName: 'tghrt',
          strhtml: '<div>啊啊啊算法</div>',
          time: '2020-1-1',
          likes: 2,
          commenters: 2
        },
        {
          id: '2_2',
          userId: 111,
          userName: 'V',
          time: '2020-1-1',
          likes: 2,
          commenters: 0,
          showMore: true,
          strhtml: '<p>中”网民“orfila2011”ch。”网民“orfila2011”在评论中atch中。”网民“orfila2011”在评论中表示；“陕西蓝天救援队”官方微博也表示watch中。”网民“orfila2011”在评论中表示；“陕西蓝天救援队”官方微博也表示watch中。”网民“orfila2011”在评论中表示；“陕西蓝天救援队”官方微博也表示watch中。”网民“orfila2011”在评论中表示；“陕西蓝天救援队”官方微博也表示watch中。”网民“orfila2011”在评论中表示；“陕西蓝天救援队”官方微博也表示watch中。”网民“orfila2011”在评论中表示；“陕西蓝天救援队”官方微博也表示watch中。”网民“orfila2011”在评论中表示；“陕西蓝天救援队”官方微博也表示watch中。”网民“orfila2011”在评论中表示；“陕西蓝天救援队”官方微博也表示watch中。”网民“orfila2011”在评论中表示；“陕西蓝天救援队”官方微博也表示watch</p>'
        },
        {
          id: '2_3',
          userId: 111,
          userName: 'V',
          time: '2020-1-1',
          likes: 2,
          commenters: 1,
          showMore: true,
          strhtml: '<p>我是小孩2-3</p>'
        }
      ]
    },
    cancelReply (idx) {
      this.listOperation[idx].showReply = false
    },
    commitReply (id, val) {
      if (val.trim() === '') {
        this.$message.error('请写点啥吧！')
        return false
      }

      let url = ''
      let param = {
        id,
        data: {
          userId: 111,
          userName: this.getUserInfo.userName,
          time: '2020-01-10 10:20:30',
          strhtml: val
        }
      }

      console.log(param)
      this.axios.post(url, param).then().catch()
    },
    openPopover (index) {
      this.$refs.popoverDelete[index].setVisible(false)
    },
    deleteOk (item, id) {
      console.log(item, id)
      this.deleteAnswer(item)
    },
    deleteAnswer (item) {
      // this.$store.getUserInfo()
      // this.answerList = []

      // console.log(item)
      this.$emit('delete', item)

      // this.TestDateFun.delete(item.id)
      // this.getAllAnswer()
    },
    // 子集删除回回复
    // deleteComment(){}
    // 获取所有回答
    getAllAnswer () {
      this.answerList = []
      this.answerList = this.TestDateFun.getData()
      // console.log(this.answerList)
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
    },
    /**
     * @description 更新列表操纵的数据
     * @param { String } 参数1
     * @param { String } 参数2
     **/
    updateOperateDate (len) {
      let vm = this
      for (let idx = 0; idx < len; idx++) {
        vm.listOperation.push({
          textareaReply: '',
          showReply: false,
          commentsList: []
        })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.ql-container.ql-snow {
  border: 1px solid #ccc;
  border: none;
}

// 回复列表最外层
.answer_list_wrap {
  padding: 18px 0;
  border-bottom: 1px solid #ddd;

  .answer_list_top {
    .small_tag_wrap {
      display: inline-block;
      position: relative;
      // width: calc(100% - 7px - 51px);
      /* height: 100%; */
      clear: both;
      height: 36px;
      margin-left: 7px;
      // vertical-align: top;

      .small_tag {
        display: inline-block;
        position: absolute;
        width: max-content;
        height: max-content;
        // font-size: 18px;
        // height: 36px;
        // line-height: 36px;
      }

      .Time {
        bottom: 0;
        font-size: 12px;
        // float: right;
        font-family: -webkit-body;
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
      padding: 12px 47px;
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
      bottom: 10px;
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
    .btn_Link:not(:first-child) {
      margin: 0 6px;
    }

    .btn_reply {
      position: relative;
    }

    .input_reply {
      padding: 12px 0px;
    }

    .btn_reply_sunmit {
      float: right;
      margin-top: 10px;
    }
    .childrenList {
      padding: 10px;
    }
  }
}

// 子集评论
.childrenList {
  border: 1px solid #ddd;
  margin-top: 20px;

  .answer_list_wrap {
    border-bottom: 0;
    padding: 10px;

    .small_tag_wrap {
      height: 28px;
      width: calc(100% - 42px);
      line-height: 28px;

      .small_tag {
        // height: inherit;
        // line-height: 28px;
      }

      .Time {
        font-size: 12px;
        position: absolute;
        right: 0px;
      }
    }

    .show_answers_val {
      padding: 5px 0;
    }
  }
}
</style>

<style >
textarea {
  font-family: yahei;
}
</style>
