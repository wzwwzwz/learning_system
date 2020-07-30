
<template>
  <div id="exam" class='component_wrap wrapper' :class="{'notes_wrap':showNotes}">
    <!------------------ 考试须知  ------------------>
    <div class="exam_notes" v-show="showNotes">
      <h3>考试须知</h3>
      <div class="notes">
        <p>请严格遵守线上考试规则；考试时间为120分钟</p>
        <p v-for="(item_des,idx_des) in rules" :key="idx_des">{{idx_des + 1}}.{{rules[idx_des]}}</p>
      </div>
      <div class="btnStart">
        <el-button type="primary" size="small" @click="startAnswerQue()">开始答题</el-button>
      </div>
    </div>

    <!------------------ 试卷 ------------------>
    <div class="exam_qus clearfix" v-show="!showNotes" v-loading.fullscreen.lock="bIsSubmit" :element-loading-text="loadingText">
      <div class="qus">

        <!-- 选择题:单选 -->
        <div class="top">
          <div :class="queTitleClass" class="title" style="">一.单选题</div>
          <template v-for="(item_sel,idx_sel) in qusList.select" class="text item">
            <el-card :key="idx_sel" class="box-card" :id="`${idPrefix[1]}_${idx_sel+1}`">

              <div slot="header" class="clearfix">
                <span>第{{idx_sel+1}}题</span>
                <span style="margin-left:10px">{{item_sel.title}}</span>
                <el-button style=" float: right; padding: 3px 0" type="text">{{item_sel.qusLevel}}</el-button>
              </div>

              <!-- 选项 -->
              <template>
                <el-radio-group v-model="answerSheet.choice[idx_sel]">
                  <el-radio :label="index_op" v-for="(item_op,index_op) in item_sel.options" :key="index_op" :disabled="bTested">
                    {{`${item_op.key}`}}.{{item_op.value}}
                  </el-radio>
                </el-radio-group>
              </template>

            </el-card>
          </template>
        </div>

        <!-- 判断题 -->
        <div class="bottom">
          <div :class="queTitleClass" class="title">二.判断题</div>
          <template v-for="(item_dec,idx_dec) in qusList.tOrF" class="text item">
            <el-card :key="idx_dec" class="box-card" :id="`${idPrefix[0]}_${idx_dec+1}`">

              <div slot="header" class="clearfix">
                <span>第{{idx_dec+1}}题</span>
                <span style="margin-left:10px">{{item_dec.title}}</span>
                <el-button style=" float: right; padding: 3px 0" type="text">{{item_dec.qusLevel}}</el-button>
              </div>

              <!-- 选项 -->
              <template>
                <el-radio-group v-model="answerSheet.tOrF[idx_dec]" :disabled="bTested">
                  <!-- 绑定值label本来为true || false; 为适应后台数据传参更改为相应格式 -->
                  <el-radio :label="true">
                    {{true | formatBooleanVal}}
                  </el-radio>
                  <el-radio :label="false">
                    {{false | formatBooleanVal}}
                  </el-radio>
                </el-radio-group>
              </template>

            </el-card>
          </template>
        </div>

      </div>

      <!------------------ 答题卡 ------------------>
      <div class="sheet">
        <div class="title ">
          <span>答题卡</span>
          <span class="time">{{this.showTimeLeft | formatTimeLeft}}</span>
        </div>

        <div class="block">
          <!-- 选择题 -->
          <div class="top">
            <div class="title">
              <span>选择题(共{{answerSheet.choice.length}}题)</span>
            </div>
            <div class="g_spilt_div_Horizontal"></div>
            <div>
              <template v-for="(item_sheet_sel,idx_sheet_sel) in answerSheet.choice">
                <a :key="idx_sheet_sel" :href="`#${idPrefix[1]}_${idx_sheet_sel+1}`" :class="{answered:item_sheet_sel !== undefined}">
                  <el-button :key="idx_sheet_sel" type="primary" plain style="margin-left: 10px;" class="btn_sheet">
                    {{idx_sheet_sel+1}}-{{ item_sheet_sel !== undefined ? String.fromCharCode(65 + item_sheet_sel) : ""}}
                  </el-button>
                </a>
              </template>
            </div>
          </div>

          <!-- 判断题 -->
          <div class="bottom">
            <div class="title">
              <span>判断题(共{{answerSheet.tOrF.length}}题)</span>
            </div>
            <div class="g_spilt_div_Horizontal"></div>
            <div>
              <template v-for="(item_sheet_dec,idx_sheet_dec) in answerSheet.tOrF">
                <a :key="idx_sheet_dec" :href="`#${idPrefix[0]}_${idx_sheet_dec+1}`" :class="{answered:item_sheet_dec !== undefined}">
                  <el-button :key="idx_sheet_dec" type="primary" plain style="margin-left: 10px;" class="btn_sheet">
                    {{idx_sheet_dec+1}}-{{formatAnswerVal(item_sheet_dec)}}
                  </el-button>
                </a>
              </template>
            </div>
          </div>

          <el-button type="primary" class="submit" :loading="bIsSubmit" @click="submit()" :disabled="bTested">{{ bIsSubmit ? "正在交卷":"交卷"}}
          </el-button>
        </div>

        <div class="block">
          <span style="font-weight:700">说明</span>
          <div>
            <div v-for="(item_des,idx_des) in rules" :key="idx_des">{{idx_des + 1}}.{{rules[idx_des]}}</div>
          </div>
        </div>

        <div class="block title score" v-show="bTested">
          <span>分数</span>
          <span class="time"> {{allScore}}</span>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { UtilsTimer, countScore } from '@/utils/index'
// 测试文件
import testExam from '@/utils/testFiles/testExam'

const ExamItem = () => import('./exam/ExamItem')

export default {
  name: '',
  components: {
    ExamItem
  },
  computed: {
    ...mapGetters(['getBasicsReqURL', 'getExamStatus', 'getUserInfo']),
    formatAnswerVal () {
      return function (val) {
        switch (val) {
          case true:
            return 'T'
          case false:
            return 'F'
          default:
            return ''
        }
      }
    },
    updateOptionClass () {
      return function (strclass, param1, param2) {
        if (param1 === param2 && this.bTested) {
          return strclass
        }
      }
    }
  },
  filters: {
    formatTimeLeft (val) {
      // console.log(val)
      if (!val) {
        return '时间到!'
      }
      let str = `${val.h}:${val.m}:${val.s}`
      return str
    }

  },
  watch: {
    qusList: {
      handler (newName, oldName) {
        console.log(newName, oldName)
        this.answerSheet.choice.length = this.qusList.select.length
        this.answerSheet.tOrF.length = this.qusList.tOrF.length
      },
      deep: true
      // immediate: true
    }
  },
  data () {
    return {
      loading: true,
      loadingText: '统计分数中',
      // 组件show属性
      showNotes: true,
      timerInterval: null,
      // 考试倒计时
      timer: null,
      // 显示剩余时间
      showTimeLeft: {},
      queTitleClass: 'el-card box-card is-always-shadow',
      // 题目列表
      qusList: {
        select: [],
        tOrF: []
      },
      answerSheet: {
        choice: [],
        tOrF: []
      },
      // id前缀
      idPrefix: {
        0: 'tf',
        1: 'select',
        2: 'multSel'
      },
      // 正在提交
      bIsSubmit: false,
      // 是否已经考完
      bTested: false,
      allScore: null,
      rules: [
        '题型分为选择题和判断题。',
        '每题分数为2分,及格线为70分。',
        '在时间内必须答完所有题目之后才能交卷。',
        '时间到系统会将目前试卷提交',
        '一周只有一次考试机会'
      ],
      // 获取后台的题目列表
      qusListResult: []
    }
  },
  created () {
    this.clearTimer()

    // 选择题
    let data = {
      title: '1+2=?',
      options: [{
        key: 'A',
        value: '3'
      },
      {
        key: 'B',
        value: '6'
      },
      {
        key: 'C',
        value: '9'
      }]
    }

    // let len = 3
    // for (let idx = 0; idx < len; idx++) {
    //   this.qusList.select.push(data)
    // }

    // // 判断题
    // let data1 = {
    //   title: '1+1=2'
    // }
    // let len2 = 2

    // for (let idx = 0; idx < len2; idx++) {
    //   this.qusList.tOrF.push(data1)
    // }
  },
  beforeDestory () {
    this.clearTimer()
  },
  beforeRouteLeave (to, from, next) {
    if (from.path === '/exam') {
      if (this.getExamStatus) {
        next(false)
        this.$message.error('考试期间不可退出')
        return
      }
    }
    next()
  },
  mounted () { },
  methods: {
    ...mapActions(['setExamStatus']),
    clearTimer () {
      if (this.timerInterval !== null) {
        clearTimeout(this.timerInterval)
      }
    },
    // 开始考试
    startAnswerQue () {
      this.showNotes = false
      this.setExamStatus(true)
      this.initExam()
      this.timer = new UtilsTimer(60 * 60 * 2)
      let vm = this
      vm.showTimeLeft = vm.timer.getTimeLeft()
      vm.timerInterval = setInterval(() => {
        vm.showTimeLeft = vm.timer.updateTime()

        if (!vm.showTimeLeft) {
          // this.showTimeLeft = '时间到'
          this.submit(true)
          return false
        }
      }, 1000)
    },
    /**
     * @description 交卷
     * @param { String } bTime 是否还有剩余时间
     **/
    submit (bTime) {
      let vm = this
      console.log('提交', bTime)
      let sheSel = this.answerSheet.choice
      let sheDec = this.answerSheet.tOrF

      console.log(sheSel, sheDec)
      console.log(this.qusList.select, this.qusList.tOrF, this.qusListResult)

      if (bTime) {
        this.bIsSubmit = true
        // 直接提交
        // let url = `${this.getBasicsReqURL}/system/role/updateRole`
        // let params = { sheSel, sheDec }
        // this.$request(url, params).then(
        //   data => {
        //     console.log(data)
        //     this.id_num = data.body
        //   }
        // )
      } else {
        if (sheSel.includes(undefined) || sheDec.includes(undefined)) {
          this.$message.error('还有题目未选择！')
          return
        }
      }

      this.clearTimer()
      // 交卷中
      this.bIsSubmit = true

      // 统计分数
      let fenshuSelect = countScore(this.qusList.select, sheSel, 20)
      let fenshuDec = countScore(this.qusList.tOrF, sheDec, 20)
      this.allScore = fenshuSelect + fenshuDec

      // 题目添加答案 (转换数据格式)
      let paramChoice = this.setAnswer(this.qusList.select, sheSel)
      let paramTOrF = this.setAnswer(this.qusList.tOrF, sheDec)
      // 合并答案
      let param = paramChoice.concat(paramTOrF)

      console.log(param)

      // 提交考试
      let objData = new this.$dataProcess.Parameter()
      objData.setFunc('submit_exam')
      param.forEach((item, idx) => {
        // console.log(item, idx)
        objData.setParams(item)
      }, vm)

      this.$request('/submitExam', { data: objData.getJson() }).then((res) => {
        console.log('ok', res)
      }).catch((error) => {
        console.log('error', error)
      }).finally(() => {
        // 后置操作
        vm.setExamStatus(false)
        vm.bIsSubmit = false
        vm.bTested = true
      })
    },
    // 获取题目列表
    getQuestion (bIsSelect) {
      let objData = new this.$dataProcess.Parameter('get_exam')

      this.$request('/getExam', { data: objData.getJson() }).then((res) => {
        console.log('ok', res)
        this.qusListResult = res.data
      }).catch((error) => {
        console.log('error', error)
      })

      let obj = this.$store.state.classTestBank
      return obj.getData(bIsSelect)
    },
    initExam () {
      // 测试
      console.log(testExam)
      this.qusListResult = testExam

      // 选择题
      this.qusList.select = this.getFilterExam('1')
      // 判断题
      this.qusList.tOrF = this.getFilterExam('0')
    },
    /**
     * @description 获取题目过滤后的
     * @param { String } 参数1
     * @param { String } 参数2
    **/
    getFilterExam (type) {
      let objOp = new this.$dataProcess.FormatOption()
      // 转化获取到的数据
      return this.qusListResult.map((item, idx) => {
        if (item.type === type) {
          return {
            key: item.key,
            title: item.question,
            options: objOp.toArr(item.option),
            type: item.type
          }
        }
        return false
      }).filter(i => i !== false)
    },
    setAnswer (que = [], sheet = [], type) {
      let objOp = new this.$dataProcess.FormatOption()

      return que.map(function (item, idx) {
        let res = {
          key: item.key,
          question: item.title,
          option: objOp.toStr(item.options),
          type: item.type,
          answer: sheet[idx]
        }
        if (item.type === '0') {
          res.answer = this.chgAnswerType(sheet[idx])
        }
        return res
      }, this)
    },
    chgAnswerType (b) {
      if (b) {
        return 0
      }
      return 1
    }

  }
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
