<template>
  <div id='queForm' class=''>
    <!-- 表单 -->
    <el-form :label-position="labelPosition" label-width="70px" :model="examQueForm" :rules="formRules" ref="examQueForm">

      <!-- 题目类型 -->
      <el-form-item label="类型" v-show="examQueForm.queType === 1">
        <el-switch style="vertical-align: baseline;" v-model="switchDate.switchVal" :active-color="switchDate.activeColor"
          :inactive-color="switchDate.inactiveColor" :active-text="switchDate.activeText" :inactive-text="switchDate.inactiveText"
          class="switch dbclick_unchecked" :active-value="switchDate.activeValue" :inactive-value="switchDate.inactiveValue"
          @change="switchChg"></el-switch>
      </el-form-item>

      <!--题目 -->
      <el-form-item label="题目" prop="examTitle">
        <el-input type="text" v-model="examQueForm.examTitle" clearable placeholder="请输入题目"></el-input>
      </el-form-item>

      <!-- 等级 -->
      <el-form-item label="级别" prop="qusLevel">
        <el-select v-model="examQueForm.qusLevel" placeholder="请选择题目级别" style="width:100%">
          <el-option v-for="item_level in getArrQusLevel" :key="item_level.key" :label="item_level.val" :value="item_level.key">
          </el-option>
        </el-select>
      </el-form-item>

      <!--知识点 -->
      <el-form-item label="知识点" prop="knowledgePoint">
        <el-select v-model="examQueForm.knowledgePoint" multiple placeholder="请选择知识点" style="display:block">
          <el-option v-for="item in updateKnowledgePoint" :key="item.label" :label="item.label" :value="item.label"></el-option>
        </el-select>
      </el-form-item>

      <!--选项 -->
      <el-form-item v-for="(item, opIdx) in examQueForm.selectOptions" :key="item.key" :label="`选项${item.key}`"
        :prop="'selectOptions.' + opIdx + '.value'" :rules="{required: true, message: '请输入选项 ', trigger: 'blur'}">
        <el-input type="text" v-model="item.value" clearable placeholder="请输入内容" :style="opIdx >= 3 ? 'width:calc(100% - 44px)':''">
        </el-input>
        <el-button icon="el-icon-close" plain @click.prevent="removeItem(item)" style="padding:12px 0;width:40px;" title="删除选项"
          v-if="opIdx >= 3">
        </el-button>
      </el-form-item>

      <el-form-item v-show="examQueForm.queType === 1">
        <el-button @click="addItem">新增选项</el-button>
      </el-form-item>

      <!-- 答案(单选) -->
      <el-form-item label="答案" prop="answer" v-show="switchDate.switchVal !== 2 || examQueForm.queType === 0">
        <el-radio-group v-model="examQueForm.answer" @change="answerChg">
          <template v-for="(item,idx) in updateAnswerList">
            <el-radio :label="idx" :key="item.key" border size="small">{{item.key | formatBooleanVal}}</el-radio>
          </template>
        </el-radio-group>
      </el-form-item>

      <!-- 答案(多选) -->
      <el-form-item label="答案()" prop="answerMulti" v-show="examQueForm.queType === 1 && switchDate.switchVal === 2">
        <el-checkbox-group v-model="examQueForm.answerMulti">
          <template v-for="(item,idx) in updateAnswerList">
            <el-checkbox :label="idx" :key="item.key" border size="small">{{item.key}}</el-checkbox>
          </template>
        </el-checkbox-group>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" @click="dialogCancel()">取 消</el-button>
      <el-button type="primary" size="medium" @click="dialogOk()">提 交</el-button>
    </span>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as check from '@/utils/validate'

export default {
  name: '',
  props: {
    initData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
  },
  computed: {
    ...mapGetters(['getKnowledgePoint', 'getArrQusLevel', 'getUserInfo']),
    updateAnswerList () {
      if (this.examQueForm.queType === 0) {
        // 判断题
        return [{ key: true }, { key: false }]
      } else {
        // 选择题
        return this.examQueForm.selectOptions
      }
    },
    updateKnowledgePoint () {
      return this.getKnowledgePoint
    }

  },
  filters: {
  },
  data () {
    return {
      labelPosition: 'left',
      // 开关
      switchDate: {
        // 选择题类型开关 1 === 单选 || 2 === 多选
        switchVal: 1,
        activeColor: '#13ce66',
        inactiveColor: '#409eff',
        activeText: '单选题',
        inactiveText: '多选题',
        activeValue: 1,
        inactiveValue: 2
      },
      // 默认选项值
      selectOptionsDefaltArr: [
        { key: 'A', value: '1' },
        { key: 'B', value: '2' },
        { key: 'C', value: '6' }
      ],
      // 出题表单
      examQueForm: {
        // 题目类型 0 === 判断题 || 1 === 选择题
        queType: 0,
        examTitle: '1+1=?',
        qusLevel: '2',
        knowledgePoint: ['业内名词'],
        answer: '',
        // 多选答案
        answerMulti: [],
        // 绑定选项
        selectOptions: [
          //   {
          //   key: 'A',
          //   value: '默认测试值1'
          // },
          // {
          //   key: 'B',
          //   value: '默认测试值12'
          // }
        ]
      },
      // 表单校验规则
      formRules: {
        examTitle: [
          { required: true, message: '请输入题目', trigger: 'blur' },
          { message: '请输入中文不能包含空格', trigger: 'blur' }
        ],
        qusLevel: [
          { required: true, message: '请选择题目等级', trigger: ['change', 'blur'] }
        ],
        knowledgePoint: [
          { required: true, message: '请选择知识点', trigger: ['change', 'blur'] }
        ],
        answer: [
          { required: true, message: '请选择答案', trigger: ['change', 'blur'] }
        ],
        answerMulti: [
          { type: 'array', required: true, message: '请至少选择一个答案', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.switchChg(this.switchDate.switchVal)
  },
  mounted () { },
  methods: {
    /**
     * @description 切换表单
     * @param { Number } 题型 0 === 判断题 || 1 === 选择题
    **/
    switchForm (type) {
      // console.log(type)
      if (!check.isNumber(type)) {
        return
      }

      this.resetForm()
      this.examQueForm.queType = type

      if (type === 0) {
        this.examQueForm.selectOptions = []
      } else {
        this.switchDate.switchVal = 1
        this.examQueForm.selectOptions = [...this.selectOptionsDefaltArr]
      }
    },
    /**
     * @description 表单确定； 需要过滤校验。分为判断题 || 选择题
    **/
    dialogOk () {
      const vm = this
      let propName = 'answerMulti'

      if (this.examQueForm.queType === 1 && this.switchDate.switchVal === 2) {
        propName = 'answer'
      }

      let fields = this.getProps(propName)
      let error = false
      vm.$refs['examQueForm'].validateField(fields, (errorMessage) => {
        if (errorMessage) {
          error = true
        }
      })

      // 测试代码
      // error = false
      if (error) {
        vm.$message.error('请填写完表单')
        return
      }

      // console.log(vm.examQueForm)

      let objData = new this.$dataProcess.Parameter()
      objData.setFunc('set_exam_item')

      // 获取表单数据
      let { examTitle, qusLevel, selectOptions: options, answer } = vm.examQueForm

      // 答案封装（多选）
      if (this.examQueForm.queType === 1 && this.switchDate.switchVal === 2) {
        let objAnswer = new this.$dataProcess.FormatOption()
        objAnswer.setSeparator(',')
        objAnswer.setItemMode(false)
        answer = objAnswer.toStr(vm.examQueForm.answerMulti.sort())
      }

      // 判断题选项
      if (this.examQueForm.queType === 0) {
        options = [{ value: '正确' }, { value: '错误' }]
      }

      // 设置请求id
      let reqId = 'add_exam_1'
      let objOption = new this.$dataProcess.FormatOption()
      let data = {
        id: reqId,
        // 新增考题key为空
        key: '',
        question: examTitle,
        option: objOption.toStr(options),
        // 答案封装
        answer: answer,
        level: qusLevel,
        authid: this.getUserInfo.userId
      }

      objData.setParams(data)

      // console.log(data)

      // 提交请求
      this.$request('/set_exam_item', { data: objData.getJson() }).then((res) => {
        console.log('ok', res)
      }).catch((error) => {
        console.log('error', error)
      })
      vm.resetForm()
    },
    dialogCancel () {
      const vm = this
      vm.resetForm()
    },
    // 选择题题型 开关切换
    switchChg (val) {
      // console.log(`切换标签${val}`)
      this.resetForm()
      val === 1 ? this.examQueForm.answer = '' : this.examQueForm.answer = []
    },
    // 添加选项
    addItem () {
      let len = this.examQueForm.selectOptions.length
      let key = String.fromCharCode(65 + len)
      this.examQueForm.selectOptions.push({ key, value: '' })
    },
    // 表单移除选项
    removeItem (item) {
      let arrOptions = this.examQueForm.selectOptions
      var index = arrOptions.indexOf(item)
      if (index !== -1) {
        arrOptions.splice(index, 1)
      }

      // console.log(arrOptions)
      this.updateOptions()
    },
    // 更新选项
    updateOptions () {
      let arrOptions = this.examQueForm.selectOptions
      for (let [idx, item] of arrOptions.entries()) {
        item.key = String.fromCharCode(65 + idx)
      }
    },
    answerChg (value) {
      // console.log(value, this.examQueForm.answer)
    },
    /**
     * @description 获取表单校验的 Props 数组；
     * @param { String } prop 过滤的表单校验值props
     * @returns { Array } 表单所有选项校验的Props值组成的数组（已过滤）
    **/
    getProps (prop) {
      let res = []
      let arrProps = this.$refs['examQueForm'].fields

      for (const item of arrProps.values()) {
        if (item.prop !== prop) {
          res.push(item.prop)
        }
      }

      return res
    },
    resetForm () {
      if (this.$refs.examQueForm) {
        this.$refs.examQueForm.resetFields()
      }
    }
  }
}
</script>

<style>
/* 覆盖elemen样式 */
#queForm .el-switch__label * {
  line-height: 1;
  font-size: 16px;
  font-weight: 700;
}
</style>

<style lang='scss' scoped>
#queForm {
  width: 100%;
  float: left;
  padding: 0px 60px;
}
.switch_wrap {
  font-size: 20px;
  font-weight: 700;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #bbb0b0;
}
.switch span {
  font-size: 20px;
  font-weight: 700;
}

.dialog-footer {
  text-align: right;
  width: 100%;
  display: inline-block;
}
</style>
