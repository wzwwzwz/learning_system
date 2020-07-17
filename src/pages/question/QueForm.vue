<template>
  <div id='queForm' class=''>
    <!-- 表单 -->
    <el-form :label-position="labelPosition" label-width="70px" :model="examQueForm" :rules="formRules" ref="examQueForm">

      <!-- 题目类型 -->
      <el-form-item label="类型" v-show="!examQueForm.bIsSelectQue">
        <el-switch style="vertical-align: baseline;" v-model="switchDate.switchVal" :active-color="switchDate.activeColor"
          :inactive-color="switchDate.inactiveColor" :active-text="switchDate.activeText" :inactive-text="switchDate.inactiveText"
          class="switch dbclick_unchecked" @change="switchChg"></el-switch>
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

      <el-form-item v-show="!examQueForm.bIsSelectQue">
        <el-button @click="addItem">新增选项</el-button>
      </el-form-item>

      <!-- 答案(单选) -->
      <el-form-item label="答案" prop="answer" v-show="switchDate.switchVal">
        <el-radio-group v-model="examQueForm.answer" @change="answerChg">
          <template v-for="(item) in updateAnswerList">
            <el-radio :label="item.key" :key="item.key" border size="small">{{item.key | formatBooleanVal}}</el-radio>
          </template>
        </el-radio-group>
      </el-form-item>

      <!-- 答案(多选) -->
      <el-form-item label="答案(" prop="answerMulti" v-show="!examQueForm.bIsSelectQue && !switchDate.switchVal">
        <el-checkbox-group v-model="examQueForm.answerList">
          <template v-for="(item) in updateAnswerList">
            <el-checkbox :label="item.key" :key="item.key" border size="small">{{item.key}}</el-checkbox>
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
import { isBoolean } from '@/utils/validate'

export default {
  name: '',
  props: {

  },
  components: {
  },
  computed: {
    ...mapGetters(['getKnowledgePoint', 'getArrQusLevel']),
    updateAnswerList () {
      if (this.examQueForm.bIsSelectQue) {
        return [{ key: true }, { key: false }]
      } else {
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
        switchVal: true,
        activeColor: '#13ce66',
        inactiveColor: '#409eff',
        activeText: '单选题',
        inactiveText: '多选题'
      },
      // 默认选项值
      selectOptionsDefaltArr: [
        { key: 'A', value: '1' },
        { key: 'B', value: '2' },
        { key: 'C', value: '6' }
      ],
      // 出题表单
      examQueForm: {
        // 是否为选择题
        bIsSelectQue: true,
        examTitle: '1+1=?',
        qusLevel: '',
        knowledgePoint: ['业内名词'],
        answer: '',
        // 多选答案
        answerList: [],
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
          { required: true, message: '请选择答案', trigger: 'change' }
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
    // @param { Boolean } 是否为考试题目弹框
    swichForm (b) {
      if (!isBoolean(b)) {
        return
      }

      if (this.$refs.examQueForm) {
        this.$refs.examQueForm.resetFields()
      }

      if (!b) {
        this.switchDate.switchVal = false
        this.switchChg(this.switchDate.switchVal)
      }
    },
    dialogOk () {
      const vm = this
      let propName = ''
      this.switchDate.switchVal ? propName = 'answerMulti' : propName = 'answer'
      let fields = this.getProps(propName)

      console.log(fields)

      let objData = new this.$dataProcess.RequestParams('get_user')
      objData.setFunc('ddd')
      objData.FUNC = 'ss'
      console.log(objData.getJson())

      let error = false
      vm.$refs['examQueForm'].validateField(fields, (errorMessage) => {
        if (errorMessage) {
          error = true
        }
      })

      if (error) {
        vm.$message.error('请填写完表单')
        return
      }

      console.log(vm.examQueForm)
      let { bIsSelectQue: bIsjudgeQue, examTitle: title, qusLevel, knowledgePoint, selectOptions: options, answer } = vm.examQueForm
      vm.$emit('submitForm', { bIsjudgeQue, title, qusLevel, knowledgePoint, options, answer })
      vm.$refs.examQueForm.resetFields()
    },
    dialogCancel () {
      const vm = this
      vm.$refs.examQueForm.resetFields()
    },
    switchChg (val) {
      console.log(`切换标签${val}`)
      if (this.$refs.examQueForm) {
        this.$refs.examQueForm.resetFields()
      }

      val ? this.examQueForm.answer = '' : this.examQueForm.answer = []
    },
    // 切换表单
    // @param { Boolean } 是否为判断题
    switchForm (val) {
      if (typeof val !== 'boolean') {
        return
      }

      if (this.$refs.examQueForm) {
        this.$refs.examQueForm.resetFields()
      }

      this.switchDate.switchVal = true
      this.examQueForm.bIsSelectQue = val

      //  true === 判断题 || false === 选择题
      val ? this.examQueForm.selectOptions = [] : this.examQueForm.selectOptions = [...this.selectOptionsDefaltArr]
    },
    addItem () {
      let len = this.examQueForm.selectOptions.length
      let key = String.fromCharCode(65 + len)
      this.examQueForm.selectOptions.push({ key, value: '' })
    },
    removeItem (item) {
      let arrOptions = this.examQueForm.selectOptions
      var index = arrOptions.indexOf(item)
      if (index !== -1) {
        arrOptions.splice(index, 1)
      }

      console.log(arrOptions)
      this.updateOptions()
    },
    updateOptions () {
      let arrOptions = this.examQueForm.selectOptions
      for (let [idx, item] of arrOptions.entries()) {
        item.key = String.fromCharCode(65 + idx)
      }
    },
    answerChg (value) {
      // console.log(value, this.examQueForm.answer)
    },
    getProps (prop) {
      let res = []
      let arrProps = this.$refs['examQueForm'].fields
      for (const item of arrProps.values()) {
        if (item.prop !== prop) {
          res.push(item.prop)
        }
      }
      return res
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
  width: calc(100% - 150px);
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
