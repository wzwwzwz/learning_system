<template>
  <div id="replyaList">
    <template v-for="(item,index) in list">
      <div :key="index" class="answer_list_wrap">
        <div class="answer_list_top">
          <!-- ------------------ 头像 ------------------ -->
          <el-avatar shape="square" :size="componentLevel === 0 ? 'medium':'small'" icon="el-icon-user-solid" class="btn_user_icon">
          </el-avatar>
          <span class="small_tag_wrap">
            <!-- 发言的用户 + 被@的用户 -->
            <span class="small_tag User">{{item.userName}}
              <span v-show="item.toUserName ">
                <!-- 被@的用户 -->
                <span style="color:#999">回复</span> {{item.toUserName}}
              </span>
            </span>
            <!-- 时间 -->
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
            @click="clickShowMore(item.strhtml,index)" ref="refShowMoreDiv">
            {{item.showMore | updateShowMorebtn}}
            <i :class="item.showMore ?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
          </div>
        </div>

        <!-- ------------------ 操作按钮 ------------------ -->
        <div class="answer_list_bottom dbclick_unchecked">
          <div>
            <!-- 点赞 -->
            <el-link type="primary" class="btn_Link" @click="likeOperation(item.id)"><i class="el-icon-thumb "></i>赞 {{`(${item.likes})`}}
            </el-link>
            <!-- 查看评论 -->
            <el-link type="primary" class="btn_Link" v-show="item.commenters !== 0 && componentLevel === 0"
              @click="viewComments(item,index)">
              <!-- 将所有回复都放在一个层级里面 -->
              <i class="el-icon-chat-dot-square"></i>{{componentLevel === 0 ? "查看评论":"查看回复"}} {{`(${item.commenters})`}}
            </el-link>
            <!-- 评论 -->
            <el-link type="primary" class="btn_Link btn_reply" @click="comment(`replyInput_level${componentLevel}_${index}`,index)">
              <i class="el-icon-reply "></i>{{componentLevel === 0 ? "评论":"回复"}}
            </el-link>
            <!-- 删除 -->
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
                    @click="commitReply(item.id,listOperation[index].textareaReply,item.id)">
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
              v-show="listOperation[index].commentsList.length !== 0  || listOperation[index].loading === true"
              v-loading.lock="listOperation[index].loading" :element-loading-text="'正在获取所有评论'">
              <ReplyList :answerList="listOperation[index].commentsList" :componentLevel="componentLevel + 1"
                @delete="deleteAnswer($event)"></ReplyList>
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
import * as check from '@/utils/validate'

// 测试代码
import TestData from '@/utils/testFiles/testData'
import testIssue from '@/utils/testFiles/testIssue'

export default {
  name: 'ReplyList',
  components: { zPopover },
  props: {
    answerList: {
      type: Array,
      default: () => []
    },
    // 组件层级
    componentLevel: {},
    // 论点数据
    issueData: {
      type: Object,
      default: () => { return {} }
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    updateShowMoreCon () {
      let vm = this
      return function (val, len, b) {
        return vm.filtesShowMore(val, 500, b)
      }
    }
  },
  watch: {
    answerList (val) {
      this.list = val
      // console.log(val)
      this.listOperation = []
      let len = val.length
      let vm = this
      // this.$nextTick(() => {
      for (let idx = 0; idx < len; idx++) {
        vm.listOperation.push({
          textareaReply: '',
          showReply: false,
          commentsList: [],
          loading: false
        })
      }
      // })
    }
  },
  data () {
    return {
      // 测试函数
      TestDateFun: new TestData(),
      // 列表操纵
      listOperation: [],
      // 接收父级传参的answerList
      list: []
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
    clickShowMore (val, idx) {
      // console.log(val)
      this.answerList[idx].showMore = !this.answerList[idx].showMore
    },
    likeOperation (key) {
      let objData = new this.$dataProcess.Parameter()
      objData.setFunc('agree_rep')
      let id = `agree_rep_${new Date().getTime()}`
      let data = {
        id,
        repkey: key
      }

      objData.setParams(data)

      this.$request('api/agree_rep', { data: objData.getJson() }).then((res) => {
        console.log('ok', res)
      }).catch((error) => {
        console.log('error', error)
      })
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
    /**
     * @description 查看所有评论
     * @param { String } item 该项的数据
     * @param { String } idx 遍历下标
    **/
    viewComments (item, idx) {
      console.log(this.issueData)
      console.log(item, idx)

      this.listOperation[idx].loading = true

      let objData = new this.$dataProcess.Parameter()
      objData.setFunc('get_issue_rep_rep')
      let data = {
        issurkey: this.issueData.key,
        repkey: item.id
      }
      objData.setParams(data)

      let vm = this
      this.$request('/get_issue_rep_rep', { data: objData.getJson() }).then((res) => {
      }).catch((error) => {
        console.log('error', error)

        vm.listOperation[idx].commentsList = [
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
        // 后台数据赋值
        vm.listOperation[idx].commentsList = vm.formatCommentData(testIssue.comment, item.userId)

        vm.listOperation[idx].loading = false
      })
    },
    cancelReply (idx) {
      this.listOperation[idx].showReply = false
    },
    // 提交回复
    commitReply (key, val, atkey) {
      if (val.trim() === '') {
        this.$message.error('请写点啥吧！')
        return false
      }

      console.log(atkey)

      let objData = new this.$dataProcess.Parameter()
      objData.setFunc('rep_rep')

      let id = `rep_rep${new Date().getTime()}`
      let data = {
        id,
        key: '',
        repkey: key,
        atkey: '',
        descript: val
      }

      objData.setParams(data)

      console.log(data)
      this.$request('rep_rep', { data: objData.getJson() }).then().catch()
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
    },
    /**
     * @description 格式化评论的数据
     * @param { Array } arr 后套获取的评论数据
     * @param { String } userId 该条回答的userId
    **/
    formatCommentData (arr = [], userId) {
      if (!check.isArray(arr)) {
        return false
      }
      let objFormat = new this.$dataProcess.FormatOption()
      objFormat.setItemMode(false)

      return arr.map((item, idx) => {
        let fromUser = objFormat.toArr(item.fromuser)
        let toUser = objFormat.toArr(item.touser)

        let data = {
          id: item.key,
          time: item.time,
          strhtml: item.descript,
          showMore: true,
          likes: item.agree
          // commenters: item.disagree
        }

        if (fromUser) {
          data.userId = fromUser[0]
          data.userName = fromUser[1]
        }

        if (toUser) {
          // 被回复的人 !== 该条回答的id
          if (toUser[0] !== userId) {
            data.toUserId = toUser[0]
            data.toUserName = toUser[1]
          }
        }

        return data
      })
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
