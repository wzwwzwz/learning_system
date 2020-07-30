<template>
  <div class="wrap">
    <!-- 权限列表 -->
    <div class="custom-tree-container">
      <div class="block">
        <el-tree :props="props" :load="loadNode" lazy :show-checkbox="showCheckbox" node-key="id" :expand-on-click-node="true">
          <!-- 备份 -->
          <!-- <el-tree :data="treedData" :show-checkbox="showCheckbox" node-key="id" default-expand-all :expand-on-click-node="false"> -->
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button type="text" size="small" @click.stop="() => append(data)">增加</el-button>
              <el-button type="text" size="small" @click.stop="() => modify(data,node)">修改</el-button>
              <el-button type="text" size="small" @click.stop="() => remove(node, data)">删除</el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>

    <!-- dialog弹框开始 -->
    <el-dialog :title="dialogTiltle" :visible.sync="dialogVisible" width="30%" @close="cancel('permissionForm')"
      :close-on-click-modal="false">
      <el-form label-width="80px" status-icon :model="permissionForm" :rules="rules" ref="permissionForm">
        <el-form-item :label="nameLabel" prop="name">
          <el-input type="text" autocomplete="on" v-model="permissionForm.name" clearable maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="text" autocomplete="on" v-model="permissionForm.descript" clearable maxlength="100"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submitForm(permissionForm)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- dialog弹框结束 -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import formValidte from '@/utils/form-validte'

export default {
  created () {
    // 从页面跳转的化需要获取
    let key = this.$route.query.key
    this.key = key
    this.getRootKey()
    // this.getCompany(key) // 获取部门等级
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getBasicsReqURL'])
  },
  data () {
    // 添加了一个最高级：所有权限
    const datatestTest = [
      {
        key: 0,
        label: '组织根目录',
        children: [],
        type: 0
      }
    ]

    return {
      // 属性结构懒加载传递的属性值
      props: {
        val: 'key',
        label: 'name',
        children: 'children',
        // 是否为叶子节点
        isLeaf: 'leaf',
        superiorkey: 'superiorkey',
        descript: 'descript'
      },
      // 树形结构数据
      treedData: JSON.parse(JSON.stringify(datatestTest)),
      // 跟节点
      rootNode: [{
        key: 0,
        name: '根目录',
        descript: '',
        superiorkey: null,
        children: [{
          key: 1,
          name: '第一级别',
          descript: '我是1级别',
          superiorkey: 0,
          children: [{}],
          leaf: false
        }],
        leaf: false
      }],
      // 是否有勾选框
      showCheckbox: false,
      // 根节点唯一标识
      rootKry: '',
      // 部门唯一标识
      key: '',
      dialogVisible: false,
      dialogTiltle: '表单名称',
      nameLabel: '部门名称',
      permissionForm: {
        name: '',
        descript: ''
      },
      // 表单校验规则
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { validator: formValidte.isEmpty, trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  methods: {
    // 加载节点
    loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve(this.rootNode)
      }

      if (node.level > 1) return resolve([])

      setTimeout(() => {
        // const data = [{
        //   name: 'fef',
        //   key: 2,
        //   leaf: true
        // }, {
        //   name: 'zone',
        //   key: 3
        // }]

        const data = node.data.children

        resolve(data)
      }, 500)
    },
    // 获取跟节点key
    getRootKey () {
      let objData = new this.$dataProcess.Parameter('get_root_key')
      let url = '/company/getRootKey'
      let vm = this
      this.$request(url, { data: objData.getJson() }).then((res) => {
        console.log('ok', res)
        if (res) {
          objData.setJson(res)
          let param = objData.getParams()
          vm.rootKry = param[0].key
          vm.rootNode[0].key = param[0].key
        }
      }).catch((error) => {
        console.log('error', error)
      })
    },
    // 获取部门等级
    getCompany (key) {
      let objData = new this.$dataProcess.Parameter('get_subordinate_department')
      objData.setParams({ key })

      this.$request(`/company/getCompany`, { data: objData.getJson() }).then(data => {
        if (data.data.companyMenuDtos.length !== 0) {
          this.treedData = data.data.companyMenuDtos
        } else {
          this.$router.push({ path: '/systemManagement/Company' })
        }
      })
    },
    // 增加子节点
    append (data) {
      // let level = data.path.split('/').length - 2
      let level = 1
      if (level >= 8) {
        this.$message.error('抱歉！部门级别最高八级')
      } else {
        this.nameLabel = '部门名称'
        // 增加时的上级key = 当前级别key
        this.permissionForm.superiorkey = data.key
        this.permissionForm.key = ''

        this.dialogVisible = true
        this.dialogTiltle = '增加'
      }
    },
    // 修改节点
    modify (data, node) {
      // 最高级别
      data.key === 0
        ? (this.nameLabel = '企业名称')
        : (this.nameLabel = '部门名称')

      this.dialogVisible = true
      this.dialogTiltle = '修改'

      let { key, name, descript, superiorkey } = data
      this.permissionForm = { key, name, descript, superiorkey }
    },

    // 删除节点
    remove (node, data) {
      this.$confirm('您确定要删除此部门? *注意:删除部门时其所有子部门将会被删除', '提示', {
        type: 'warning'
      })
        // 点击确定
        .then(() => {
          // 删除接口
          let url = '/company/deleteCompany'
          let objData = new this.$dataProcess.Parameter('del_department')
          objData.setParams({ key: data.key })
          this.$request(url, { data: objData.getJson() }).then(data => {
            if (data.code === 200) {
              this.$message.info(data.msg)
              if (data.msg === '删除成功') {
                this.getCompany(this.key)
              }
            }
          })
        })
        // 点击取消
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    // 取消表单提交
    cancel () {
      const vm = this
      vm.dialogVisible = false
      vm.$refs.permissionForm.resetFields()
      vm.$refs.permissionForm.clearValidate()
    },
    // 提交表单
    submitForm (data) {
      this.$refs.permissionForm.validate(valid => {
        if (valid) {
          let objData = new this.$dataProcess.Parameter()
          objData.setFunc('set_department')

          if (this.dialogTiltle === '增加') {
            let url = `/company/insertCompany`
            let id = `add_${new Date().getTime()}`
            data.id = id
            objData.setParams(data)

            this.addModifyInterface(url, objData.getJson())
          } else {
            let url = `/company/updateCompany`
            let id = `modify_${new Date().getTime()}`
            data.id = id
            objData.setParams(data)

            this.addModifyInterface(url, data)
          }
          this.dialogVisible = false
        } else {
          this.$message.error('请填写完表单')
        }
      })
    },
    // 添加(修改)接口
    addModifyInterface (url, paramData) {
      this.$request(url, { data: paramData }).then(data => {
        if (data.code === 200) {
          if (data.msg === '添加成功' || data.msg === '修改成功') {
            this.getCompany(this.key)
          }
        }
      })
    }
  }
}
</script>
<style scoped>
/* .wrap {

} */

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.custom-tree-node span:nth-child(2) {
  display: inline-block;
}
.el-select {
  width: 100%;
}
</style>
