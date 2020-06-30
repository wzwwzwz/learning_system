<template>
  <div class='component_wrap wrapper' :class="{'notes_wrap':showNotes}">
    <!------------------ 考试须知  ------------------>
    <div class="exam_notes" v-show="showNotes">
      <h3>考试须知</h3>
      <div class="notes">
        <p>请严格遵守线上考试规则；考试时间为120分钟，考题分为选择题和判断题；</p>
      </div>
      <div class="btnStart">
        <el-button type="primary" size="small" @click="startAnswerQue()">开始答题</el-button>
      </div>
    </div>

    <!------------------ 试卷 ------------------>
    <div class="exam_qus clearfix" v-show="!showNotes">
      <div class="qus">

        <!-- 选择题 -->
        <div class="top">
          <div :class="queTitleClass" class="title">单选题</div>
          <template v-for="(item,index) in qusList.selectQusList" class="text item">
            <el-card class="box-card" :key="index" :id="`select_${index+1}`">
              <div slot="header" class="clearfix">
                <span>第{{index+1}}题</span>
                <span style="margin-left:10px">{{item.title}}</span>
                <el-button style=" float: right; padding: 3px 0" type="text">难度{{1}}</el-button>
              </div>

              <!-- 选项 -->
              <template>
                <el-radio-group v-model="qusList.answerSheetSel[index]">
                  <el-radio :label="item_op.key" v-for="(item_op,index) in item.options" :key="index">
                    {{`${item_op.key}`}}.{{item_op.value}}
                  </el-radio>
                </el-radio-group>
              </template>

            </el-card>
          </template>
        </div>

        <!-- 判断题 -->
        <div class="bottom">
          <div :class="queTitleClass" class="title">判断题</div>
          <template v-for="(item,index) in qusList.decQusLise" class="text item">
            <el-card class="box-card" :key="index" :id="`dec_${index+1}`">
              <div slot="header" class="clearfix">
                <span>第{{index+1}}题</span>
                <span style="margin-left:10px">{{item.title}}</span>
                <el-button style=" float: right; padding: 3px 0" type="text">难度{{1}}</el-button>
              </div>

              <!-- 选项 -->
              <template>
                <el-radio-group v-model="qusList.answerSheetdec[index]">
                  <el-radio label=true>{{true | formatVal}}</el-radio>
                  <el-radio label=false>{{false | formatVal}}</el-radio>
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

        <div style="padding: 0 10px;margin-top:10px">
          <div class="top">
            <div class="title">
              <span>选择题(共{{qusList.answerSheetSel.length}}题)</span>
            </div>
            <div class="g_spilt_div_Horizontal"></div>
            <div>
              <template v-for="(item,index) in qusList.answerSheetSel">
                <a :key="index" :href="`#select_${index+1}`" :class="{answered:item !== undefined}">
                  <el-button :key="index" type="primary" plain style="margin-left: 10px;" class="btn_sheet">
                    {{index+1}}-{{item}}
                  </el-button>
                </a>
              </template>
            </div>
          </div>

          <div class="bottom">
            <div class="title">
              <span>判断题(共{{qusList.answerSheetdec.length}}题)</span>
            </div>
            <div class="g_spilt_div_Horizontal"></div>
            <div>
              <template v-for="(item,index) in qusList.answerSheetdec">
                <a :key="index" :href="`#dec_${index+1}`" :class="{answered:item !== undefined}">
                  <el-button :key="index" type="primary" plain style="margin-left: 10px;" class="btn_sheet">
                    {{index+1}}-{{formatAnswerVal(item)}}
                  </el-button>
                </a>
              </template>
            </div>
          </div>

          <el-button type="primary" class="submit" @click="submit()">交卷</el-button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { UtilsTimer } from '@/utils/index'

export default {
  name: '',
  components: {},
  computed: {
    ...mapGetters(['getBasicsReqURL']),
    formatAnswerVal () {
      return function (val) {
        switch (val) {
          case 'true':
            return 'T'
          // break
          case 'false':
            return 'F'
          // break
          default:
            return ''
          // break
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
      timerInterval: null,
      // 计时
      timer: null,
      showTimeLeft: {},
      activeNames: ['1'],
      showNotes: true,
      queTitleClass: 'el-card box-card is-always-shadow',
      qusList: {
        selectQusList: [],
        decQusLise: [],
        answerSheetSel: [],
        answerSheetdec: []
      }

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
  mounted () { },
  methods: {
    ...mapActions(['setExamStatus']),
    clearTimer () {
      if (this.timerInterval !== null) {
        clearTimeout(this.timerInterval)
      }
    },
    startAnswerQue () {
      this.showNotes = false
      this.setExamStatus(true)
      this.timer = new UtilsTimer(10)
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
    // @param { boolean } 是否还剩余时间
    submit (bTime) {
      let sheSel = this.qusList.answerSheetSel
      let sheDec = this.qusList.answerSheetdec

      console.log(sheSel, sheDec)

      if (bTime) {
        // 直接提交
        let url = `${this.getBasicsReqURL}/system/role/updateRole`
        let params = { sheSel, sheDec }
        this.axios.post(url, params).then(
          data => {
            console.log(data)
            this.id_num = data.body
          }
        )
      } else {
        if (sheSel.includes(undefined) || sheDec.includes(undefined)) {
          this.$message.error('还有题目未选择！')
          return
        }
      }

      this.setExamStatus(false)
      this.clearTimer()
    }
  }
}
</script>
<style lang='scss' scoped>
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

  .qus {
    width: calc(100% - 310px);
    margin-right: 10px;
    float: left;

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
