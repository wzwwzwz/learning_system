
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

        <!-- 选择题 -->
        <div class="top">
          <div :class="queTitleClass" class="title" style="">一.单选题</div>
          <template v-for="(item_sel,idx_sel) in qusList.selectQusList" class="text item">
            <div :key="idx_sel">
              <el-card class="box-card" :id="`select_${idx_sel+1}`">
                <div slot="header" class="clearfix">
                  <span>第{{idx_sel+1}}题</span>
                  <span style="margin-left:10px">{{item_sel.title}}</span>
                  <el-button style=" float: right; padding: 3px 0" type="text">{{item_sel.type}}</el-button>
                </div>

                <!-- 选项 -->
                <template>
                  <el-radio-group v-model="qusList.answerSheetSel[idx_sel]">
                    <el-radio :label="item_op.key" v-for="(item_op,index_op) in item_sel.options" :key="index_op" :disabled="bTested"
                      :class="{correct_answer_bg:item_op.key === item_sel.answer && bTested,error_answer_bg:item_op.key === qusList.answerSheetSel[idx_sel] && bTested}">
                      {{`${item_op.key}`}}.{{item_op.value}}
                      <!-- {{`${item_op.key}`}} === {{qusList.answerSheetSel[idx_sel]}} -->
                    </el-radio>
                  </el-radio-group>
                </template>

              </el-card>
              <div class="el-card__header correct_answer" v-show="bTested">正确选项为 {{item_sel.answer}}</div>
            </div>

          </template>
        </div>

        <!-- 判断题 -->
        <div class="bottom">
          <div :class="queTitleClass" class="title">二.判断题</div>
          <template v-for="(item_dec,idx_dec) in qusList.decQusLise" class="text item">
            <div :key="idx_dec">
              <el-card class="box-card" :id="`dec_${idx_dec+1}`">
                <div slot="header" class="clearfix">
                  <span>第{{idx_dec+1}}题</span>
                  <span style="margin-left:10px">{{item_dec.title}}</span>
                  <el-button style=" float: right; padding: 3px 0" type="text">{{item_dec.type}}</el-button>
                </div>

                <!-- 选项 -->
                <template>
                  <el-radio-group v-model="qusList.answerSheetdec[idx_dec]" :disabled="bTested">
                    <el-radio :label=true
                      :class="{correct_answer_bg:true === item_dec.answer && bTested,error_answer_bg:true === qusList.answerSheetdec[idx_dec] && bTested}">
                      {{true | formatVal}}
                    </el-radio>
                    <!-- <el-radio :label=true :class="updateOptionClass(correct_answer_bg,item_dec.answer,true)">
                    {{true | formatVal}}
                  </el-radio> -->
                    <el-radio :label=false
                      :class="{correct_answer_bg:false === item_dec.answer && bTested,error_answer_bg:false === qusList.answerSheetdec[idx_dec] && bTested}">
                      {{false | formatVal}}
                    </el-radio>
                  </el-radio-group>
                </template>

              </el-card>
              <div class="el-card__header correct_answer" v-show="bTested">正确选项为 {{item_dec.answer | formatVal}}</div>
            </div>
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
              <span>选择题(共{{qusList.answerSheetSel.length}}题)</span>
            </div>
            <div class="g_spilt_div_Horizontal"></div>
            <div>
              <template v-for="(item_sheet_sel,idx_sheet_sel) in qusList.answerSheetSel">
                <a :key="idx_sheet_sel" :href="`#select_${idx_sheet_sel+1}`" :class="{answered:item_sheet_sel !== undefined}">
                  <el-button :key="idx_sheet_sel" type="primary" plain style="margin-left: 10px;" class="btn_sheet">
                    {{idx_sheet_sel+1}}-{{item_sheet_sel}}
                  </el-button>
                </a>
              </template>
            </div>
          </div>

          <!-- 判断题 -->
          <div class="bottom">
            <div class="title">
              <span>判断题(共{{qusList.answerSheetdec.length}}题)</span>
            </div>
            <div class="g_spilt_div_Horizontal"></div>
            <div>
              <template v-for="(item_sheet_dec,idx_sheet_dec) in qusList.answerSheetdec">
                <a :key="idx_sheet_dec" :href="`#dec_${idx_sheet_dec+1}`" :class="{answered:item_sheet_dec !== undefined}">
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

export default {
  name: '',
  components: {},
  computed: {
    ...mapGetters(['getBasicsReqURL', 'getExamStatus']),
    formatAnswerVal () {
      return function (val) {
        switch (val) {
          case true:
            return 'T'
          // break
          case false:
            return 'F'
          // break
          default:
            return ''
          // break
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
    formatVal (val) {
      if (typeof val !== 'boolean') {
        return val
      }

      if (val) {
        return '正确'
      } else {
        return '错误'
      }
    },
    formatTimeLeft (val) {
      // console.log(val)
      if (!val) {
        return '时间到!'
      }
      let string = `${val.h}:${val.m}:${val.s}`
      return string
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
        selectQusList: [],
        decQusLise: [],
        answerSheetSel: [],
        answerSheetdec: []
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
      ]
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

    let len = 3
    for (let idx = 0; idx < len; idx++) {
      this.qusList.selectQusList.push(data)
    }
    this.qusList.answerSheetSel.length = len

    // 判断题
    let data1 = {
      title: '1+1=2'
    }
    let len2 = 2

    for (let idx = 0; idx < len2; idx++) {
      this.qusList.decQusLise.push(data1)
    }
    this.qusList.answerSheetdec.length = len2
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
      this.timer = new UtilsTimer(60)
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
      console.log('提交', bTime)
      let sheSel = this.qusList.answerSheetSel
      let sheDec = this.qusList.answerSheetdec

      console.log(sheSel, sheDec)

      if (bTime) {
        this.bIsSubmit = true
        // 直接提交
        // let url = `${this.getBasicsReqURL}/system/role/updateRole`
        // let params = { sheSel, sheDec }
        // this.axios.post(url, params).then(
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

      // 交卷中
      this.bIsSubmit = true

      // 统计分数
      let fenshuSelect = countScore(this.qusList.selectQusList, sheSel, 20)
      let fenshuDec = countScore(this.qusList.decQusLise, sheDec, 20)
      this.allScore = fenshuSelect + fenshuDec

      this.setExamStatus(false)
      this.clearTimer()
      this.bIsSubmit = false
      this.bTested = true
    },
    // 获取题目列表
    getQuestion (bIsSelect) {
      let obj = this.$store.state.classTestBack

      return obj.getData(bIsSelect)
    },
    initExam () {
      // 选择题
      this.qusList.selectQusList = this.getQuestion(true)
      this.qusList.answerSheetSel.length = this.qusList.selectQusList.length
      // 判断题
      this.qusList.decQusLise = this.getQuestion(false)
      this.qusList.answerSheetdec.length = this.qusList.decQusLise.length
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
    width: calc(100% - 310px);
    margin-right: 10px;
    float: left;
    margin-bottom: 40%;

    .text {
      font-size: 14px;
    }

    .item {
      margin-bottom: 18px;
    }

    .box-card {
      // width: 480px;
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
    width: 300px;
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
      span {
        // padding: 10px;
      }
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
  .el-radio__input.is-disabled + span.el-radio__label,
  .el-radio__input.is-checked + .el-radio__label {
    color: inherit;
  }
}
</style>
