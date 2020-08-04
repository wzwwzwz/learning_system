<template>
  <div id="addIssueDialog" class=''>
    <!-- width="50%" -->
    <el-dialog :title="dialogTiltle" :visible.sync="dialogVisible" :close-on-click-modal="false" :before-close="dialogCancel">
      <!-- 表单 -->
      <el-form :label-position="'left'" label-width="70px" :model="issueForm" :rules="formRules" ref="issueForm">
        <!--题目 -->
        <el-form-item label="题目" prop="title">
          <el-input type="text" v-model="issueForm.title" clearable placeholder="请输入题目"></el-input>
        </el-form-item>

        <!--知识点 -->
        <el-form-item label="知识点" prop="knowledgePoint">
          <el-select v-model="issueForm.knowledgePoint" multiple placeholder="请选择知识点" style="display:block">
            <el-option v-for="item in updateKnowledgePoint" :key="item.label" :label="item.label" :value="item.label"></el-option>
          </el-select>
        </el-form-item>

        <!-- 描述 -->
        <el-form-item label="描述" prop="descript">
          <el-input type="text" autocomplete="on" v-model="issueForm.descript" clearable maxlength="100"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel()">取 消</el-button>
        <el-button type="primary" @click="dialogOk()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isBoolean } from '@/utils/validate'
import formValidte from '@/utils/form-validte'

export default {
  name: 'addIssueDialog',
  props: {
    dialogTiltle: {
      type: String,
      default: () => '添加论点'
    }
  },
  components: {},
  computed: {
    ...mapGetters(['getKnowledgePoint', 'getArrQusLevel']),
    updateKnowledgePoint () {
      return this.getKnowledgePoint
    }
  },
  filters: {
  },
  data () {
    return {
      dialogVisible: false,
      // 出题表单
      issueForm: {
        title: '1+1=?',
        knowledgePoint: [],
        descript: ''
      },
      // 表单校验规则
      formRules: {
        title: [
          { required: true, message: '请输入题目', trigger: 'blur' },
          { message: '请输入中文不能包含空格', trigger: 'blur' },
          { validator: formValidte.isEmpty, trigger: ['change', 'blur'] }
        ],
        knowledgePoint: [
          { required: true, message: '请选择知识点', trigger: ['change', 'blur'] }
        ],
        descript: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ]
      }
    }
  },
  created () {

  },
  mounted () { },
  methods: {
    // @param { Boolean } 是否为考试题目弹框
    openDialog (b) {
      if (!isBoolean(b)) {
        return
      }

      this.dialogVisible = true
    },
    dialogOk () {
      const vm = this
      vm.$refs.issueForm.validate(valid => {
        if (!valid) {
          vm.$message.error('请填写完表单')
          return
        }

        let { title, knowledgePoint, descript } = vm.issueForm

        let objData = new this.$dataProcess.Parameter()
        objData.setFunc('set_issue')
        let id = `addIssue_${new Date().getTime()}`
        let data = {
          id,
          key: '',
          title,
          knowledgePoint,
          descript,
          status: ''
        }
        objData.setParams(data)

        this.$request('/addIssue', { data: objData.getJson() }).then((res) => {
          console.log('ok', res)
        }).catch((error) => {
          console.log('error', error)
        }).finally(() => {
          // vm.$emit('submitForm', { title, knowledgePoint, descript })
          vm.dialogVisible = false
          vm.$refs.issueForm.resetFields()
        })
      })
    },
    dialogCancel () {
      const vm = this
      vm.dialogVisible = false
      vm.$refs.issueForm.resetFields()
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
