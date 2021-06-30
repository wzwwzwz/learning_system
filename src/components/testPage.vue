<template >
  <div id="testPage">
    <div style="margin-top: 15px;">
      <!-- ------------- 测试注释 -->
      <el-input placeholder="请输入内容" v-model="input3" class="input-with-select" clearable @keyup.enter.native="search(input3,select)">
        <el-select v-model="select" slot="prepend" placeholder="请选择" clearable>
          <el-option label="餐厅名" value="1"></el-option>
          <el-option label="订单号" value="2"></el-option>
          <el-option label="用户电话" value="3"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="search(input3,select)"></el-button>
      </el-input>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      input1: '',
      input2: '',
      input3: '',
      select: ''
    }
  },
  methods: {
    search (input3, select) {
      console.log(input3, select)
    }
  }
}
</script>

<style lang="scss">
#testPage {
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
