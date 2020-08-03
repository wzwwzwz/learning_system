
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

      <!------------------ 题目 ------------------>
      <div class="question">

        <!-- 选择题:单选 -->
        <div class="top">
          <ExamItem :queTypeTitle="`一.${mapData.get(1).name}`" :qusList="qusList.singleSel" :idPrefix="mapData.get(1).idPrefix">
            <template slot="options" slot-scope="props">

              <!-- 选项 -->
              <el-radio-group v-model="answerSheet.singleSel[props.idx]">
                <template v-for="(item_op,index_op) in props.item.options">
                  <el-radio :label="index_op" :key="index_op" :disabled="bTested">
                    {{`${item_op.key}`}}.{{item_op.value}}
                  </el-radio>
                </template>
              </el-radio-group>

            </template>
          </ExamItem>
        </div>

        <!-- 多选题 -->
        <div class="center">
          <ExamItem :queTypeTitle="`二.${mapData.get(2).name}`" :qusList="qusList.multiSel" :idPrefix="mapData.get(2).idPrefix">
            <template slot="options" slot-scope="props">

              <!-- 选项 -->
              <el-checkbox-group v-model="answerSheet.multiSel[props.idx]">
                <template v-for="(item_op_mul,idx_op_mul) in props.item.options">
                  <el-checkbox :label="idx_op_mul" :key="item_op_mul.key">
                    {{`${item_op_mul.key}`}}.{{item_op_mul.value}}
                  </el-checkbox>
                </template>
              </el-checkbox-group>

            </template>
          </ExamItem>
        </div>

        <!-- 判断题 -->
        <div class="bottom">
          <ExamItem :queTypeTitle="`三.${mapData.get(0).name}`" :qusList="qusList.tOrF" :idPrefix="mapData.get(0).idPrefix">
            <template slot="options" slot-scope="props">

              <!-- 选项 -->
              <el-radio-group v-model="answerSheet.tOrF[props.idx]" :disabled="bTested">
                <!-- 绑定值label本来为true || false; 为适应后台数据传参更改为相应格式 -->
                <el-radio :label="true">
                  {{true | formatBooleanVal}}
                </el-radio>
                <el-radio :label="false">
                  {{false | formatBooleanVal}}
                </el-radio>
              </el-radio-group>

            </template>
          </ExamItem>
        </div>

      </div>

      <!------------------ 答题卡 ------------------>
      <div class="sheet">
        <div class="title">
          <span>答题卡</span>
          <span class="time">{{this.showTimeLeft | formatTimeLeft}}</span>
        </div>

        <div class="block">
          <!-- 单选题 -->
          <div class="top">
            <AnswerItem :queTypeTitle="mapData.get(1).name" :answerList="answerSheet.singleSel" :idPrefix="mapData.get(1).idPrefix">
            </AnswerItem>
          </div>

          <!-- 多选题 -->
          <div class="center">
            <AnswerItem :queTypeTitle="mapData.get(2).name" :answerList="answerSheet.multiSel" :idPrefix="mapData.get(2).idPrefix">
            </AnswerItem>
          </div>

          <!-- 判断题 -->
          <div class="bottom">
            <AnswerItem :queTypeTitle="mapData.get(0).name" :answerList="answerSheet.tOrF" :idPrefix="mapData.get(0).idPrefix"></AnswerItem>
          </div>

          <!-- 交卷按钮 -->
          <el-button type="primary" class="submit" :loading="bIsSubmit" @click="submit()" :disabled="bTested">{{ bIsSubmit ? "正在交卷":"交卷"}}
          </el-button>
        </div>

        <!-- 考试说明 -->
        <div class="block">
          <span style="font-weight:700">说明</span>
          <div>
            <div v-for="(item_des,idx_des) in rules" :key="idx_des">{{idx_des + 1}}.{{rules[idx_des]}}</div>
          </div>
        </div>

        <!-- 分数 -->
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
import { UtilsTimer } from '@/utils/index'
// 测试文件
import testExam from '@/utils/testFiles/testExam'

const ExamItem = () => import('./ExamItem')
const AnswerItem = () => import('./AnswerItem')

export default {
  name: '',
  components: {
    ExamItem,
    AnswerItem
  },
  computed: {
    ...mapGetters(['getBasicsReqURL', 'getExamStatus', 'getUserInfo'])
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
    // 监听题目列表
    qusList: {
      handler (newVal, oldVal) {
        this.answerSheet.singleSel = this.qusList.singleSel.map(() => '')
        this.answerSheet.tOrF = this.qusList.tOrF.map(() => '')
        // 多选绑定的是二维数据
        this.answerSheet.multiSel = this.qusList.multiSel.map(() => [])
      },
      deep: true
      // immediate: true
    }
  },
  data () {
    // 传递数据解析
    // idPrefix 标识id前缀
    const mapData = new Map()
    mapData.set(0, { name: '判断题', idPrefix: 'TF' })
    mapData.set(1, { name: '单选题', idPrefix: 'singleSel' })
    mapData.set(2, { name: '多选题', idPrefix: 'multiSel' })

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
      // 题目列表
      qusList: {
        tOrF: [],
        singleSel: [],
        multiSel: []
      },
      answerSheet: {
        tOrF: [],
        singleSel: [],
        multiSel: []
      },
      mapData: mapData,
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
    // let data = {
    //   title: '1+2=?',
    //   options: [{
    //     key: 'A',
    //     value: '3'
    //   },
    //   {
    //     key: 'B',
    //     value: '6'
    //   },
    //   {
    //     key: 'C',
    //     value: '9'
    //   }]
    // }

    // let len = 3
    // for (let idx = 0; idx < len; idx++) {
    //   this.qusList.singleSel.push(data)
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
      let answerTF = this.answerSheet.singleSel
      let answerSS = this.answerSheet.tOrF
      let answerMS = this.answerSheet.multiSel

      console.log(answerTF, answerSS, answerMS)

      if (bTime) {
        this.bIsSubmit = true
        // 时间到直接提交
        // let url = `${this.getBasicsReqURL}/system/role/updateRole`
        // let params = { answerTF, answerSS }
        // this.$request(url, params).then(
        //   data => {
        //     console.log(data)
        //     this.id_num = data.body
        //   }
        // )
      } else {
        if (answerTF.includes('') || answerSS.includes('') || !this.checkAnswerMulSel()) {
          this.$message.error('还有题目未选择！')
          return
        }
      }

      this.clearTimer()
      // 交卷中
      this.bIsSubmit = true

      // 题目添加答案 (转换数据格式)
      let paramSS = this.setAnswer(this.qusList.singleSel, answerTF)
      let paramTF = this.setAnswer(this.qusList.tOrF, answerSS)
      let paramMS = this.setAnswer(this.qusList.multiSel, answerMS)

      // 合并答案
      let param = paramSS.concat(paramTF, paramMS)

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
      this.qusList.singleSel = this.getFilterExam('1')
      // 判断题
      this.qusList.tOrF = this.getFilterExam('0')
      // 多选题
      this.qusList.multiSel = this.getFilterExam('2')
    },
    /**
     * @description 获取题目过滤后的
     * @param { String } type 题目类别
     * @returns { Array } 相应类别的题目组成的数组 || [] === 找不到
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
    /**
     * @description 设置答案(把答案加入到题目列表里面并且转换成请求传参格式)
     * @param { Array } que 题目列表
     * @param { Array } sheet 答案列表
     * @returns { Array } 题目和答案组成的数组
    **/
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
        // 判断题
        if (item.type === '0') {
          res.answer = this.chgAnswerType(sheet[idx])
        }

        // 多选题
        if (item.type === '2') {
          res.answer = sheet[idx].toString()
        }

        return res
      }, this)
    },
    chgAnswerType (b) {
      if (b) {
        return 0
      }
      return 1
    },
    // 校验多选题答案
    checkAnswerMulSel () {
      let arr = this.answerSheet.multiSel
      for (let idx = 0; idx < arr.length; idx++) {
        let item = arr[idx]
        if (item.length === 0) {
          return false
        }
      }
      return true
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

// 考试提示
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

// 试卷
.exam_qus {
  $sheet-width: 300px;
  .question,
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

  // 题目
  .question {
    width: calc(100% - 10px - #{$sheet-width});
    margin-right: 10px;
    float: left;
    margin-bottom: 40%;

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

  // 答题卡
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

    .top {
      margin-bottom: 10px;
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

// 按钮组
.el-radio,
.el-checkbox {
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

  .el-checkbox.is-bordered + .el-checkbox.is-bordered {
    margin-left: 0px;
  }
}
</style>
