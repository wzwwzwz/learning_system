<template>
  <div class=''>
    <!-- 用户操作dialog弹框开始 -->
    <!-- width="50%" -->
    <el-dialog :title="dialogTiltle" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <slot name="examType" v-if="bEaxmQueDia">
        <!-- 题目类型 -->
        <div class="switch_wrap dbclick_unchecked">
          <span>题目类型：</span>
          <el-switch style="vertical-align: baseline;" v-model="switchDate.switchVal" :active-color="switchDate.activeColor"
            :inactive-color="switchDate.inactiveColor" :active-text="switchDate.activeText" :inactive-text="switchDate.inactiveText"
            class="switch" @change="switchChg"></el-switch>
        </div>
      </slot>

      <!-- 表单 -->
      <el-form :label-position="labelPosition" label-width="70px" :model="examQueForm" :rules="formRules" ref="examQueForm">
        <!--题目 -->
        <el-form-item label="题目" prop="examTitle">
          <el-input type="text" v-model="examQueForm.examTitle" clearable placeholder="请输入题目"></el-input>
        </el-form-item>

        <!--知识点 -->
        <el-form-item label="知识点" prop="knowledgePoint">
          <el-select v-model="examQueForm.knowledgePoint" multiple placeholder="请选择知识点" style="display:block">
            <el-option v-for="item in knowledgeOptions" :key="item.label" :label="item.label" :value="item.label"></el-option>
          </el-select>
        </el-form-item>

        <slot name="optionsSlot" v-if="bEaxmQueDia">
          <!--选项 -->
          <el-form-item v-for="(item, index) in examQueForm.selectOptions" :key="item.key" :label="`选项${String.fromCharCode(65 + index)}`"
            :prop="'selectOptions.' + index + '.value'" :rules="{required: true, message: '请输入选项 ', trigger: 'blur'}">
            <el-input type="text" v-model="item.value" clearable placeholder="请输入内容" style="width:calc(100% - 44px)"></el-input>
            <el-button icon="el-icon-close" plain @click.prevent="removeItem(item)" style="padding:12px 0;width:40px;" title="删除选项"
              v-if="index >= 2">
            </el-button>
          </el-form-item>

          <el-form-item>
            <el-button @click="addItem" v-show="!examQueForm.bIsSelectQue">新增选项</el-button>
          </el-form-item>
        </slot>

        <slot name="answer" v-if="bEaxmQueDia">
          <!--答案 -->
          <el-form-item label="答案" prop="answer">
            <el-radio-group v-model="examQueForm.answer" @change="answerChg">
              <template v-for="(item) in updateAnswerList">
                <el-radio :label="item.key" :key="item.key">{{item.key | formatVal}}</el-radio>
              </template>
            </el-radio-group>
          </el-form-item>
        </slot>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel()">取 消</el-button>
        <el-button type="primary" @click="dialogOk()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 用户操作dialog弹框结束 -->
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    knowledgeOptions: {
      type: Array,
      default: () => []
    },
    dialogTiltle: {
      type: String,
      default: () => ''
    }
  },
  components: {
  },
  computed: {
    updateAnswerList () {
      if (this.examQueForm.bIsSelectQue) {
        return [{ key: true }, { key: false }]
      } else {
        return this.examQueForm.selectOptions
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
    }
  },
  data () {
    return {
      // 是否为考试题目弹框
      bEaxmQueDia: false,
      dialogVisible: false,
      labelPosition: 'left',
      // 开关
      switchDate: {
        switchVal: false,
        activeColor: '#13ce66',
        inactiveColor: '#409eff',
        activeText: '判断题',
        inactiveText: '选择题'
      },
      // 知识点
      // knowledgeOptions: [{
      //   value: '选项1',
      //   label: '黄金糕'
      // }, {
      //   value: '选项2',
      //   label: '双皮奶'
      // }, {
      //   value: '选项3',
      //   label: '蚵仔煎'
      // }, {
      //   value: '选项4',
      //   label: '龙须面'
      // }, {
      //   value: '选项5',
      //   label: '北京烤鸭'
      // }],
      // 默认选项值
      selectOptionsDefaltArr: [
        { key: 'A', value: '默认测试值1' },
        { key: 'B', value: '默认测试值12' }
      ],
      // 答案列表
      answerList: [],
      // 出题表单
      examQueForm: {
        // 是否为选择题
        bIsSelectQue: true,
        examTitle: 'ddd',
        knowledgePoint: [],
        answer: '',
        // 绑定选项
        selectOptions: [{
          key: 'A',
          value: '默认测试值1'
        },
        {
          key: 'B',
          value: '默认测试值12'
        }]
      },
      // 表单校验规则
      formRules: {
        examTitle: [{
          required: true,
          message: '请输入题目',
          trigger: 'blur'
        },
        {
          //   pattern: window._check.isChineseReg,
          message: '请输入中文不能包含空格',
          trigger: 'blur'
        }
        ],
        knowledgePoint: [{
          required: true,
          message: '请选择知识点',
          trigger: 'change'
        }],
        answer: [
          { required: true, message: '请选择答案', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    // console.log(String.fromCharCode(65 + 0))
    this.switchChg(this.switchDate.switchVal)
    // this.answerList = this.examQueForm.selectOptions
  },
  mounted () { },
  methods: {
    // @param { Boolean } 是否为考试题目弹框
    openDialog (b) {
      if (typeof b !== 'boolean') {
        return
      }

      this.bEaxmQueDia = b
      this.dialogVisible = true

      if (!b) {
        this.switchDate.switchVal = false
        this.switchChg(this.switchDate.switchVal)
      }
    },
    dialogOk () {
      const vm = this
      vm.$refs.examQueForm.validate(valid => {
        // console.log(vm.examQueForm)

        if (valid) {
          // 考试题目弹框确认
          if (this.bEaxmQueDia) {
            let { bIsSelectQue, examTitle: title, knowledgePoint, selectOptions: options, answer } = vm.examQueForm
            vm.$emit('submitForm', { bIsSelectQue, title, knowledgePoint, options, answer })
          } else {
            let { examTitle: title, knowledgePoint } = vm.examQueForm
            vm.$emit('submitForm', { title, knowledgePoint })
          }
          vm.dialogVisible = false
          vm.$refs.examQueForm.resetFields()
        } else {
          vm.$message.error('请填写完表单')
        }
      })
    },
    dialogCancel () {
      const vm = this
      vm.dialogVisible = false
      // vm.examQueForm.roleName = ''
      // vm.examQueForm.description = ''
      // // vm.getRoleInfo() // 刷新表格
      vm.$refs.examQueForm.resetFields()
    },
    switchChg (val) {
      // console.log(`切换标签${val}`)
      this.switchForm(val)
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

      if (val) {
        this.examQueForm.selectOptions = []
      } else {
        this.examQueForm.selectOptions = JSON.parse(JSON.stringify(this.selectOptionsDefaltArr))
      }
      this.examQueForm.bIsSelectQue = val
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
    },
    answerChg (value) {
      console.log(value, this.examQueForm.answer)
    }
  }
}
</script>

<style>
/* 覆盖elemen样式 */
.el-switch__label * {
  line-height: 1;
  font-size: 20px;
  font-weight: 700;
}
</style>

<style lang='scss' scoped>
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
</style>
